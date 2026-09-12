/* =====================================================================
 * 移动端手势增强（仅粗指针 / 触摸设备启用）
 *  - 横向滑动切换主页面（今日 / 饮食 / 活动养护 / 我的），带跟手动画
 *  - 顶部下拉刷新：松开后用本地数据重新渲染当前页面
 * 桌面端（鼠标 / 细指针）不绑定任何监听，布局与滚动保持原样。
 * 依赖 app.js 中的全局函数：selectPage / render / toast
 * ===================================================================== */
(function () {
  var app = document.getElementById('app');
  if (!app) return;
  var coarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
  if (!coarse) return;
  if (typeof selectPage !== 'function') return;

  var VIEWS = ['home', 'diet', 'move', 'me'];
  var els = VIEWS.map(function (id) { return document.getElementById('view-' + id); });
  var ptr = document.getElementById('ptr');

  // ---- 工具函数 ----------------------------------------------------
  function visibleIndex() {
    for (var i = 0; i < els.length; i++) {
      if (els[i] && !els[i].classList.contains('hidden')) return i;
    }
    return 0;
  }
  // 横向可滚动子区域（筛选条等）：让它们自己处理滑动，不要抢手势
  function inXScroller(t) {
    return !!(t.closest && (
      t.closest('.chips') || t.closest('.seg') || t.closest('.ob-track') || t.closest('[data-swipe-skip]')
    ));
  }
  // 这些区域不触发翻页 / 下拉：输入控件、链接、底部标签栏、引导弹层
  function inUI(t) {
    return !!(t.closest && (
      t.closest('.tabbar') || t.closest('input,textarea,select') || t.closest('a') || t.closest('.onboard')
    ));
  }

  // ---- 手势状态 ----------------------------------------------------
  var startX = 0, startY = 0, startScroll = 0;
  var mode = null;        // pending | page | ptr | busy | done
  var cur = null, nbr = null, nbrIndex = 0, viewW = 0, swipeSign = 0, pulling = 0;
  var suppressClick = false;

  function clearRefs() { mode = null; cur = null; nbr = null; pulling = 0; swipeSign = 0; }

  function resetPtr() {
    if (!ptr) return;
    ptr.className = 'ptr';
    ptr.style.transform = '';
    var tx = ptr.querySelector('.ptr-tx');
    if (tx) tx.textContent = '下拉刷新';
  }

  // 临时把当前页与相邻页并排成横向分页器，跟手滑动
  function enterPager(c, n, w, sign, scrollTop) {
    [c, n].forEach(function (v) {
      v.style.position = 'absolute';
      v.style.top = '0';
      v.style.bottom = 'calc(64px + env(safe-area-inset-bottom))';
      v.style.left = '0';
      v.style.width = w + 'px';
      v.style.overflowY = 'auto';
      v.style.webkitOverflowScrolling = 'touch';
      v.style.background = 'var(--bg)';
      v.style.zIndex = '10';
      v.classList.add('pager-view');
    });
    c.scrollTop = scrollTop || 0;
    n.scrollTop = 0;
    n.style.left = (-sign * w) + 'px';   // 下一页在右(sign<0)、上一页在左(sign>0)
    n.style.transform = 'translateX(0px)';
    c.style.transform = 'translateX(0px)';
  }

  function cleanupPager(c, n) {
    [c, n].forEach(function (v) {
      if (!v) return;
      v.style.position = ''; v.style.top = ''; v.style.bottom = '';
      v.style.left = ''; v.style.width = ''; v.style.overflowY = '';
      v.style.webkitOverflowScrolling = ''; v.style.background = '';
      v.style.zIndex = ''; v.style.transform = ''; v.style.transition = '';
      v.classList.remove('pager-view');
    });
  }

  // 翻页 / 下拉期间抑制误触发的底层 click（避免滑动后跳按钮）
  document.addEventListener('click', function (ev) {
    if (suppressClick) { ev.stopPropagation(); ev.preventDefault(); }
  }, true);

  // ---- 触摸事件 ----------------------------------------------------
  function onStart(e) {
    if (mode) return;
    if (inUI(e.target)) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startScroll = window.scrollY || document.documentElement.scrollTop || 0;
    mode = 'pending';
  }

  function onMove(e) {
    if (!mode || mode === 'done' || mode === 'busy') return;
    var dx = e.touches[0].clientX - startX;
    var dy = e.touches[0].clientY - startY;

    if (mode === 'pending') {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;     // 等待明确方向
      if (inXScroller(e.target)) { mode = 'done'; return; }  // 交给子区域

      if (Math.abs(dx) > Math.abs(dy)) {
        // 横向 → 翻页
        var idx = visibleIndex();
        var target = -1;
        if (dx < 0 && idx < VIEWS.length - 1) target = idx + 1;     // 向左滑 → 下一页
        else if (dx > 0 && idx > 0) target = idx - 1;               // 向右滑 → 上一页
        if (target < 0) { mode = 'done'; return; }                  // 边缘，不拦截
        mode = 'page';
        suppressClick = true; setTimeout(function () { suppressClick = false; }, 350);
        cur = els[idx];
        nbr = els[target];
        nbrIndex = target;
        swipeSign = dx < 0 ? -1 : 1;
        viewW = cur.offsetWidth || window.innerWidth;
        nbr.classList.remove('hidden');
        enterPager(cur, nbr, viewW, swipeSign, startScroll);
      } else {
        // 纵向
        if (dy < 0 || startScroll > 0) { mode = 'done'; return; }   // 向上或已滚动 → 正常滚动
        mode = 'ptr';
        suppressClick = true; setTimeout(function () { suppressClick = false; }, 350);
        cur = els[visibleIndex()];
      }
    }

    if (mode === 'page') {
      e.preventDefault();
      var lo = Math.min(0, swipeSign * viewW), hi = Math.max(0, swipeSign * viewW);
      var t = Math.max(lo, Math.min(hi, dx));
      cur.style.transform = 'translateX(' + t + 'px)';
      nbr.style.transform = 'translateX(' + t + 'px)';
    } else if (mode === 'ptr') {
      e.preventDefault();
      pulling = Math.min(120, dy * 0.5);
      cur.style.transform = 'translateY(' + pulling + 'px)';
      if (ptr) {
        ptr.className = 'ptr show' + (pulling >= 60 ? ' ready' : '');
        ptr.style.transform = 'translate(-50%,' + (pulling - 30) + 'px)';
        var tx = ptr.querySelector('.ptr-tx');
        if (tx) tx.textContent = pulling >= 60 ? '松开刷新' : '下拉刷新';
      }
    }
  }

  function onEnd(e) {
    if (!mode || mode === 'pending' || mode === 'done') { mode = null; return; }
    var touch = e.changedTouches ? e.changedTouches[0] : null;
    var dx = touch ? touch.clientX - startX : 0;

    if (mode === 'page') {
      var c = cur, n = nbr, ni = nbrIndex, w = viewW, s = swipeSign;
      var go = Math.abs(dx) > Math.max(60, w * 0.22);
      c.style.transition = n.style.transition = 'transform .28s cubic-bezier(.22,.61,.36,1)';
      if (go) {
        c.style.transform = 'translateX(' + (s * w) + 'px)';
        n.style.transform = 'translateX(' + (s * w) + 'px)';
        mode = 'busy';
        setTimeout(function () {
          cleanupPager(c, n);
          selectPage(VIEWS[ni], {}, true);
          try { window.scrollTo(0, 0); } catch (_) {}
          clearRefs();
        }, 300);
      } else {
        c.style.transform = 'translateX(0px)';
        n.style.transform = 'translateX(0px)';
        mode = 'busy';
        setTimeout(function () { cleanupPager(c, n); clearRefs(); }, 300);
      }
    } else if (mode === 'ptr') {
      var cv = cur;
      cv.style.transition = 'transform .25s ease';
      if (pulling >= 60) {
        cv.style.transform = 'translateY(56px)';
        if (ptr) ptr.className = 'ptr show loading';
        mode = 'busy';
        setTimeout(function () {
          if (typeof render === 'function') render();
          try { window.scrollTo(0, 0); } catch (_) {}
          cv.style.transform = ''; cv.style.transition = '';
          resetPtr();
          if (typeof toast === 'function') toast('已刷新');
          clearRefs();
        }, 300);
      } else {
        cv.style.transform = ''; cv.style.transition = '';
        resetPtr();
        clearRefs();
      }
    }
  }

  function onCancel() {
    if (mode === 'page' && cur && nbr) cleanupPager(cur, nbr);
    if (cur) { cur.style.transform = ''; cur.style.transition = ''; }
    resetPtr();
    clearRefs();
  }

  app.addEventListener('touchstart', onStart, { passive: true });
  app.addEventListener('touchmove', onMove, { passive: false });
  app.addEventListener('touchend', onEnd, { passive: true });
  app.addEventListener('touchcancel', onCancel, { passive: true });
})();
