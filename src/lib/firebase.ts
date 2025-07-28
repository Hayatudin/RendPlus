
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAUpexPSXiNLdOvthfNx1ou95OZDDV42Zc",
  authDomain: "rendplus-97563.firebaseapp.com",
  projectId: "rendplus-97563",
  storageBucket: "rendplus-97563.firebasestorage.app",
  messagingSenderId: "485810713578",
  appId: "1:485810713578:web:970e06d088e0dfac9f7893",
  measurementId: "G-NM789W9FGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging: any = null;

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Error initializing Firebase messaging:', error);
  }
}

export { messaging };

// Function to get FCM token
export const getFCMToken = async () => {
  if (!messaging) {
    throw new Error('Messaging not initialized');
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: 'BLuGYtdcJLcoOyDO-mk-IQiD2udp8UsucLWJlzJQFUeSBi7OtHcNqWTJ3vU0T6J3RUvq_lY1xADQzLfI1VHreOU'
    });
    return token;
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    throw error;
  }
};

// Function to handle foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
