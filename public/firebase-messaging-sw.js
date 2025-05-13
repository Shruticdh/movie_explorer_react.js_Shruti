importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyA-ovOQODK1M7bODI3-HQd6-Yzw4STOxQE",
  authDomain: "movieexplorer-ce91a.firebaseapp.com",
  projectId: "movieexplorer-ce91a",
  storageBucket: "movieexplorer-ce91a.firebasestorage.app",
  messagingSenderId: "344250613941",
  appId: "1:344250613941:web:7af5db6cef5513df67fefc",
  measurementId: "G-M5C2JN6KT2"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
