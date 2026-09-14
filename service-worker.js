const CACHE = 'nuannian-shell-v072-mobile';
const SHELL = [
  './', './index.html', './manifest.json',
  './icon.svg?v=2', './icon-180.png?v=2', './icon-192.png?v=2', './icon-512.png?v=2',
  './css/style.css', './css/design.css',
  './js/data-exercise.js', './js/data-care.js', './js/data-core.js', './js/data-diet.js',
  './js/data-recipes-extra.js', './js/data-dish.js', './js/data-video.js', './js/data-fit-video.js',
  './js/recipe-bv.js', './js/app.js', './js/mobile.js', './js/gestures.js',
  './assets/photos/hero-cartoon.webp',
  './assets/photos/window-light.jpg', './assets/photos/table.jpg', './assets/photos/chair.jpg', './assets/photos/walk.jpg'
];

self.addEventListener('install', event => {
  /* 逐个添加，允许个别资源失败：避免部署过渡期某资源临时 404 导致整个 SW 安装失败、更新被卡住。 */
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(SHELL.map(u => cache.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put('./index.html', copy));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(request).then(cached => {
    const network = fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    });
    return cached || network;
  }));
});

// 收到页面「跳过等待」指令后立即激活新版本（配合更新横幅的「刷新」按钮）
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
