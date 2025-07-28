
export const showNotification = async (title: string, body: string, options?: any): Promise<void> => {
  try {
    console.log('Attempting to show notification:', title, body);
    
    // Always try to use service worker registration first (works on all devices)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('Using service worker to show notification');
        await registration.showNotification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'rendplus-notification',
          requireInteraction: true,
          silent: false,
          ...options
        });
        return;
      }
    }

    console.log('Service worker not available, notification shown via service worker only');
  } catch (error) {
    console.error('Error showing notification:', error);
    // Silent fallback - don't throw error to user
  }
};

export const checkNotificationPermission = (): string => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications');
  }

  if (!('serviceWorker' in navigator)) {
    throw new Error('This browser does not support service workers');
  }

  console.log('Registering service worker...');
  
  // Register service worker first
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/'
  });
  console.log('Service Worker registered:', registration);

  // Wait for service worker to be ready
  await navigator.serviceWorker.ready;
  console.log('Service Worker is ready');

  // Check current permission status
  let permission = Notification.permission;
  
  console.log('Current notification permission:', permission);
  
  // If permission is default (not asked yet), request it
  if (permission === 'default') {
    console.log('Requesting notification permission...');
    permission = await Notification.requestPermission();
    console.log('Permission result:', permission);
  }
  
  return permission;
};

export const unregisterServiceWorkers = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.scope.includes('firebase-messaging-sw.js')) {
        await registration.unregister();
        console.log('Service worker unregistered');
      }
    }
  }
};
