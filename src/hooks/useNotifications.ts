
import { useState, useEffect } from 'react';
import { initializeFCM, saveAdminFCMToken, removeAdminFCMToken } from '@/utils/fcm';
import { 
  showNotification, 
  checkNotificationPermission, 
  requestNotificationPermission,
  unregisterServiceWorkers 
} from '@/utils/notifications';
import { setupForegroundMessageListener } from '@/utils/messageListener';

export function useNotifications() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Check if notifications are currently enabled
  useEffect(() => {
    const checkNotificationStatus = () => {
      if ('Notification' in window) {
        setIsEnabled(Notification.permission === 'granted');
      }
    };
    
    checkNotificationStatus();

    // Listen for foreground messages
    setupForegroundMessageListener();
  }, []);

  const enableNotifications = async () => {
    try {
      const permission = await requestNotificationPermission();
      
      // Handle different permission states
      if (permission === 'denied') {
        throw new Error('Notification permission was denied. Please enable notifications in your browser settings and try again.');
      }
      
      if (permission !== 'granted') {
        throw new Error('Notification permission was not granted. Please allow notifications and try again.');
      }

      // Get FCM token if messaging is available
      const token = await initializeFCM();
      if (token) {
        setFcmToken(token);
        // Save the FCM token for admin notifications
        await saveAdminFCMToken(token);
      }

      // Permission granted - enable notifications
      setIsEnabled(true);
      console.log('Notifications enabled successfully');
      
      // Show a confirmation notification
      await showNotification(
        '🔔 Notifications Enabled!',
        'You will now receive push notifications for new quote submissions on all your devices.'
      );
      
    } catch (error) {
      console.error('Error enabling notifications:', error);
      throw error;
    }
  };

  const disableNotifications = async () => {
    await removeAdminFCMToken();
    setIsEnabled(false);
    setFcmToken(null);
    console.log('Notifications disabled');
    
    // Unregister service worker if needed
    await unregisterServiceWorkers();
  };

  const sendTestNotification = async (message: string) => {
    if (!isEnabled) {
      throw new Error('Notifications are not enabled');
    }

    try {
      await showNotification('🧪 Test Notification', message, {
        requireInteraction: true
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  };

  const checkPermissionStatus = () => {
    return checkNotificationPermission();
  };

  return {
    isEnabled,
    fcmToken,
    enableNotifications,
    disableNotifications,
    sendTestNotification,
    checkPermissionStatus
  };
}
