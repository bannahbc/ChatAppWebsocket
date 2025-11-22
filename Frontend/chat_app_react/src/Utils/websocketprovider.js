// WebSocketProvider.js
import React, { createContext, useEffect, useState } from "react";
// Assuming WEBSOCKET_URL is defined, e.g., 'ws://localhost:8000/ws/'
import { WEBSOCKET_URL } from "../Api/websocket_url"; 
import { useContext } from 'react';
// Create two separate contexts: one for the raw socket and one for presence data
export const WSContext = createContext(null);
export const PresenceContext = createContext([]);

export const WSProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // State to hold the latest presence map: { user_id: { online: true, lastSeen: '...' }, ... }
  const [presenceData, setPresenceData] = useState({}); 

  useEffect(() => {
    // Construct the full WebSocket URL
    const ws = new WebSocket(`${WEBSOCKET_URL}presence/`);

    ws.onopen = () => {
      console.log("WebSocket: Connected to Presence channel");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle specific presence update message type
        if (data.type === "presence_update" && data.user_id) {
          console.log(`Presence update for user ${data.user_id}: ${data.online ? 'Online' : 'Offline'}`);

          // Update the presenceData map
          setPresenceData(prev => ({
            ...prev,
            [data.user_id]: {
              online: data.online,
              lastSeen: data.lastSeen,
            },
          }));
        }
        // You could add handling for other message types (e.g., 'new_message_notification') here
        
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket: Disconnected");

    setSocket(ws);
    
    // Cleanup: close the socket when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (
    <WSContext.Provider value={socket}>
      <PresenceContext.Provider value={presenceData}>
        {children}
      </PresenceContext.Provider>
    </WSContext.Provider>
  );
};

// --- Custom Hook for easy consumption ---


// Hook to get the latest presence data map
export const usePresence = () => useContext(PresenceContext);

// Hook to get the raw socket instance (less common, usually for sending messages)
export const useSocket = () => useContext(WSContext);