/* UROVO V58 push notification service worker. Upload beside index.html on the same HTTPS host. */
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('push', event => {
  let payload = {};
  try {
    const raw = event.data ? event.data.text() : '';
    if (raw) {
      try { payload = JSON.parse(raw); }
      catch (_) { payload = { message: raw }; }
    }
  } catch (_) {}
  const title = String(payload.title || payload.notification?.title || 'UROVO Update');
  const body = String(payload.message || payload.body || payload.notification?.body || 'You have a new update from UROVO.');
  const url = String(payload.url || payload.data?.url || './');
  const options = {
    body,
    icon: payload.icon || './icons/icon-192.png',
    badge: payload.badge || './icons/icon-192.png',
    tag: String(payload.tag || payload.event || 'urovo-update'),
    renotify: true,
    data: { url }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification?.data?.url || './', self.registration.scope).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        if (client.url !== target && 'navigate' in client) { try { await client.navigate(target); } catch (_) {} }
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});