import React, { useEffect } from "react";
import RoutingModule from "./routingModule/routingModule";
import { generateToken, messaging } from "./Notification/firebase";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      const { title, body } = payload.notification || {};

    if (title && body) {
      toast(`${title}: ${body}`);
    }

    });
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1f2937", 
            color: "#f9fafb", 
            border: "1px solid #374151",
            padding: "12px 16px",
            fontSize: "0.95rem",
            fontWeight: "500",
            borderRadius: "8px",
          },

          // Different styles for different toast types
          success: {
            iconTheme: {
              primary: "#10b981", // green-500
              secondary: "#ecfdf5", // green-50
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // red-500
              secondary: "#fee2e2", // red-100
            },
          },
        }}
      />
      <RoutingModule />
    </>
  );
};

export default App;
