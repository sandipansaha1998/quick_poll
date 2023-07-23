import { io } from "socket.io-client";

const URL = "https://polling-api-lbat.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
});

export const connectionManager = (socket) => {
  return {
    connect: () => {
      socket.connect();
    },

    disconnect: () => {
      socket.disconnect();
    },
  };
};
// socketManager.js

export const socketManager = {
  listeners: [],

  addListener: (event, callback) => {
    socket.on(event, callback);
    socketManager.listeners.push(event);
  },

  removeListener: (event) => {
    socket.off(event);
    socketManager.listeners = socketManager.listeners.filter(
      (listener) => listener !== event
    );
  },

  emitToMountedComponents: (event, data) => {
    socketManager.listeners.forEach((listener) => {
      socket.emit(event, data);
    });
  },
};
