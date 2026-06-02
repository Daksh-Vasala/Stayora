import { io } from "socket.io-client";

export const socket = io("https://stayora-backend-x75x.onrender.com/", {
  withCredentials: true
});