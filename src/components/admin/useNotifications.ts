// src/hooks/useNotifications.ts
import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { firebaseApp } from '@/lib/firebase'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export function useNotifications() {
  useEffect(() => {
    // 1) Ask for permission
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        console.warn('Notification permission not granted')
        return
      }

      // 2) Get FCM registration token
      const messaging = getMessaging(firebaseApp)
      getToken(messaging, {
        // Make sure you’ve added your VAPID key to .env:
        // NEXT_PUBLIC_VAPID_KEY=“<your‑vapid‑key>”
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY
      })
        .then(currentToken => {
          if (!currentToken) {
            console.error('No registration token available.')
            return
          }
          // 3) Upsert into admin_fcm_tokens
          supabase
            .from('admin_fcm_tokens')
            .upsert({ fcm_token: currentToken }, { onConflict: 'fcm_token' })
            .then(({ error }) => {
              if (error) console.error('Error saving FCM token:', error)
            })
        })
        .catch(err => console.error('getToken error', err))

      // 4) Optional: handle messages while the app is in the foreground
      onMessage(messaging, payload => {
        console.log('Foreground message:', payload)
        new Notification(payload.notification?.title || '', {
          body: payload.notification?.body || '',
        })
      })
    })
  }, [])
}
