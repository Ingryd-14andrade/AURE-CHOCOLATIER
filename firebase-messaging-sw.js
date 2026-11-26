/* Aure Gestão · recebe as notificações de pedido novo mesmo com o app fechado */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

importScripts('/config.js');
const FIREBASE = self.AURE_FIREBASE;

if (!/^COLE/.test(FIREBASE.apiKey)) {
  firebase.initializeApp(FIREBASE);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(payload => {
    const d = payload.data || {};
    self.registration.showNotification(d.titulo || '🍫 Novo pedido na Aure!', {
      body: d.corpo || 'Abra o painel para ver.',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: d.id || 'pedido',
      renotify: true,
      vibrate: [120, 60, 120],
      data: { url: '/gestao#pedidos' }
    });
  });
}

self.addEventListener('notificationclick', ev => {
  ev.notification.close();
  ev.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return clients.openWindow('/gestao#pedidos');
  }));
});
