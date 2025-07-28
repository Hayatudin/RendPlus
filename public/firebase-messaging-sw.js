
// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyAUpexPSXiNLdOvthfNx1ou95OZDDV42Zc",
  authDomain: "rendplus-97563.firebaseapp.com",
  projectId: "rendplus-97563",
  storageBucket: "rendplus-97563.firebasestorage.app",
  messagingSenderId: "485810713578",
  appId: "1:485810713578:web:970e06d088e0dfac9f7893",
  measurementId: "G-NM789W9FGM"
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

console.log('Firebase messaging service worker loaded');

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'New Quote Submission';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new quote submission to review',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'rendplus-notification',
    requireInteraction: true,
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  console.log('Showing notification:', notificationTitle, notificationOptions);
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);

  event.notification.close();

  // Handle different actions
  if (event.action === 'dismiss') {
    console.log('Notification dismissed');
    return;
  }
  
  // Default action or 'open' action - open the app
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      console.log('Found clients:', clientList.length);
      
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          console.log('Focusing existing client');
          return client.focus();
        }
      }
      
      // If no existing window/tab was found, open a new one
      if (clients.openWindow) {
        console.log('Opening new window:', urlToOpen);
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle push events (fallback)
self.addEventListener('push', function(event) {
  console.log('[firebase-messaging-sw.js] Push event received:', event);
  
  if (event.data) {
    const payload = event.data.json();
    console.log('Push payload:', payload);
    
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'rendplus-push',
      requireInteraction: true,
      data: payload.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

console.log('Firebase messaging service worker setup complete');
