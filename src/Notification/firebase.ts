import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { sendTokenToBackend } from "../Services/userServices";

const firebaseConfig = {

  apiKey: "AIzaSyA-ovOQODK1M7bODI3-HQd6-Yzw4STOxQE",
  authDomain: "movieexplorer-ce91a.firebaseapp.com",
  projectId: "movieexplorer-ce91a",
  storageBucket: "movieexplorer-ce91a.firebasestorage.app",
  messagingSenderId: "344250613941",
  appId: "1:344250613941:web:7af5db6cef5513df67fefc",
  measurementId: "G-M5C2JN6KT2"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    if (Notification.permission === "granted") {
      const vapidKey = "BPTOciy1kiAJiFGHaLpWnZrV58ZhCgRkGmVlh66WlZLoO1RaQibVb4CRNP4OeNCr7iNl17Awiynee1mEXbnl3XI";

      const token = await getToken(messaging, { vapidKey });

      if (token) {
        console.log("Existing FCM Token:", token);
        if (typeof token === "string" && token.length >= 50) {
          await sendTokenToBackend(token);
          return token;
        }
      }
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        console.warn("Notification permission not granted:", permission);
        return null;
      }
    }

      const vapidKey = "BPTOciy1kiAJiFGHaLpWnZrV58ZhCgRkGmVlh66WlZLoO1RaQibVb4CRNP4OeNCr7iNl17Awiynee1mEXbnl3XI";
    const token = await getToken(messaging, { vapidKey });
    console.log("New FCM Token:", token);

    if (!token || typeof token !== "string" || token.length < 50) {
      console.warn("Generated token appears invalid");
      return null;
    }

     sendTokenToBackend(token);
    console.log("Token sent to backend:", token);
    return token;
  } catch (error) {
    console.error("Error generating FCM token or sending to backend:", error);
    return null;
  }
};

export const monitorToken = async () => {
  try {
    const vapidKey = "BPTOciy1kiAJiFGHaLpWnZrV58ZhCgRkGmVlh66WlZLoO1RaQibVb4CRNP4OeNCr7iNl17Awiynee1mEXbnl3XI";
    const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
      if (
        error.code === "messaging/token-unsubscribed" ||
        error.code === "messaging/invalid-token"
      ) {
        console.log("Token invalid or unsubscribed, generating new token");
        const newToken = await generateToken();
        return newToken;
      }
      throw error;
    });

    if (token) {
      if (typeof token !== "string" || token.length < 50) {
        console.warn("Monitored token appears invalid");
        return null;
      }
      console.log("Token validated:", token);
      await sendTokenToBackend(token);
    }
    return token;
  } catch (error) {
    console.error("Error monitoring FCM token:", error);
    return null;
  }
};

export { onMessage };