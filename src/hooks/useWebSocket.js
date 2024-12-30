import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useWebSocket = (url) => {
  const socketRef = useRef();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url);

      socketRef.current.on("connect", () => {
        console.log("WebSocket connecté avec l'ID:", socketRef.current.id);
        setSocketConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("WebSocket déconnecté");
        setSocketConnected(false);
      });
    }

    // Nettoyage du socket quand le composant se démonte
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
      }
    };
  }, [url]);

  // Fonction pour émettre des événements
  const socketEmit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    } else {
      console.error(
        "WebSocket non connecté. Impossible d'émettre l'événement:",
        event
      );
    }
  };

  // Fonction pour écouter des événements
  const socketOn = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    } else {
      console.error(
        "WebSocket non connecté. Impossible d'écouter l'événement:",
        event
      );
    }
  };

  // Fonction pour désécouter un événement spécifique
  const socketOff = (event) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    } else {
      console.error(
        "WebSocket non connecté. Impossible de désécouter l'événement:",
        event
      );
    }
  };

  return {
    socketRef,
    socketConnected,
    socketEmit,
    socketOn,
    socketOff,
  };
};
