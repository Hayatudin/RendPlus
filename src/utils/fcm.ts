
import { messaging, getFCMToken } from '@/lib/firebase';
import { supabase } from '@/integrations/supabase/client';

export const initializeFCM = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn('Firebase messaging not available');
    return null;
  }

  try {
    console.log('Requesting FCM token...');
    const token = await getFCMToken();
    console.log('FCM Token received:', token);
    return token;
  } catch (error) {
    console.error('Could not get FCM token:', error);
    return null;
  }
};

export const saveAdminFCMToken = async (token: string): Promise<void> => {
  try {
    console.log('Saving FCM token to database...');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    const { error } = await supabase
      .from('admin_fcm_tokens')
      .upsert({
        user_id: user.id,
        fcm_token: token,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    } else {
      console.log('FCM token saved successfully');
    }
  } catch (error) {
    console.error('Error saving admin FCM token:', error);
    throw error;
  }
};

export const removeAdminFCMToken = async (): Promise<void> => {
  try {
    console.log('Removing FCM token from database...');
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('admin_fcm_tokens')
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error removing FCM token:', error);
      } else {
        console.log('FCM token removed successfully');
      }
    }
  } catch (error) {
    console.error('Error removing FCM token:', error);
  }
};
