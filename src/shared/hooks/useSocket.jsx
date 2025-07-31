import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io("https://kivora-back.onrender.com/", {
      query: { userId },
    });

    socketRef.current = socket;
    setSocketInstance(socket); 

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketInstance;
};
