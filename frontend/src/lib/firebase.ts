// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported as analyticsIsSupported, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCscMgnxsLXxcm9QxFSlbd9WKw4gODSKbg",
  authDomain: "mutitpay-d5a4a.firebaseapp.com",
  projectId: "mutitpay-d5a4a",
  storageBucket: "mutitpay-d5a4a.firebasestorage.app",
  messagingSenderId: "4394276381",
  appId: "1:4394276381:web:c120c7ee5a73d02a8e58f4",
  measurementId: "G-QJSNC7Y3TR"
};

// Debug: print firebase config at runtime to validate configuration (remove in production)
try {
  // Initialize Firebase
  var app = initializeApp(firebaseConfig);
} catch (err) {
  // Provide clearer runtime error when initialization fails (e.g., invalid API key)
  throw err;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Optional analytics (only in browser & if measurementId present)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  // Guard: only attempt if environment supports it (e.g., not in SSR / some browsers)
  analyticsIsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Silently ignore analytics init errors
    });
}

export { analytics };
export default app;
