
import { messaging, onMessageListener } from '@/lib/firebase';
import { showNotification } from './notifications';

export const setupForegroundMessageListener = (): void => {
  if (messaging) {
    onMessageListener()
      .then((payload: any) => {
        console.log('Foreground message received:', payload);
        // Use service worker notifications when available
        showNotification(
          payload.notification?.title || 'New Quote Submission',
          payload.notification?.body || 'You have a new quote submission to review'
        );
      })
      .catch((err) => console.log('Failed to receive foreground message:', err));
  }
};
