/* UROVO PWA service worker v106 — root icon paths + cache-busted install fix */
'use strict';
const CACHE_NAME = 'urovo-pwa-v106';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest?v=106',
  './icon-192.png?v=106',
  './icon-512.png?v=106',
  './apple-touch-icon.png?v=106'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of APP_SHELL) {
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (response && response.ok) await cache.put(url, response);
        else console.warn('UROVO PWA resource unavailable:', url, response && response.status);
      } catch (error) {
        console.warn('UROVO PWA resource failed:', url, error);
      }
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('urovo-pwa-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, { cache: 'no-cache' });
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
