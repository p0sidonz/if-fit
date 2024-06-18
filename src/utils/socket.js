import { API_URL } from "../modules/consts";
import { io } from "socket.io-client";
import { makeMessagesSeen } from "../modules/chat/chatSlice";
import store from "src/store/store";
let socket;

if (typeof window !== "undefined") {
  // Code to run only on the client side
  const token = localStorage.getItem("accessToken");

  socket = io(API_URL, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  socket.on("isSeen", (payload) => {
    console.log("isSeen", payload);
    store.dispatch(makeMessagesSeen(payload));
  });
}

export const sendMessage = (message) => {
  if (socket) {
    socket.emit("sendMessage", {
      message,
    });
  } else {
    console.error("Socket is not initialized");
  }
};

export const seenMessage = ({ recipientId, chatId, senderId, isTrue}) => {
  if (socket) {
    socket.emit("messageSeen", {
      recipientId,
      chatId,
      senderId,
    });
  }
};

// export const dekhLiya = ({ recipientId, chatId, senderId, isTrue }) => {
//   console.log("dekhLiya", recipientId, chatId, senderId)
//   if (socket) {
//     socket.emit("messageSeen", {
//       kiskobtanahaiwaps: senderId ,
//       chatId,
//       kisneYeEmitKiyaHai: recipientId,
//       isTrue: isTrue,
//     });
//   }
// };

export default socket;
