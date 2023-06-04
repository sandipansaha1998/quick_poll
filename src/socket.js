import { io } from "socket.io-client";

const URL = "http://localhost:5050";

export const socket = io(URL, {
  autoConnect: false,
});

export const connectionManager = () => {
  return {
    connect: () => {
      socket.connect();
    },

    disconnect: () => {
      socket.disconnect();
    },
  };
};
