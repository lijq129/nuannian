(() => {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const swUrl = './service-worker.js';

  // 应用更新：让等待中的 worker 跳过等待并接管，随后刷新页面拿到新版本
  function applyUpdate() {
    if (!navigator.serviceWorker.controller) { location.reload(); return; }
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!reloaded) { reloaded = true; location.reload(); }
    });
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg && reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    });
  }
  window.__applySWUpdate = applyUpdate;

  // 通知页面：有新版本已就绪，可显示更新提示
  function notifyReady() {
    window.dispatchEvent(new CustomEvent('sw-update-ready'));
  }

  function bindReg(reg) {
    if (reg.waiting) { notifyReady(); return; }
    reg.addEventListener('updatefound', () => {
      const installing = reg.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed') {
          if (navigator.serviceWorker.controller) notifyReady();
          else if (reg.active) reg.active.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });
  }

  // 直接注册（本脚本位于 body 末尾，DOM 已就绪，无需等 load；脚本即 /service-worker.js 同源）
  navigator.serviceWorker.register(swUrl).then(bindReg).catch(() => {});
  // 页面长期打开时也定期检查更新（每 60 分钟）
  setInterval(() => {
    navigator.serviceWorker.getRegistration().then(r => r && r.update().then(bindReg).catch(() => {}));
  }, 60 * 60 * 1000);
})();
