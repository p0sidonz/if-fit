import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../modules/consts';
import { makeMessagesSeen } from '../modules/chat/chatSlice';
import store from 'src/store/store';

const useWebSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    socketRef.current = io(API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server/Hook');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socketRef.current.on('isSeen', (payload) => {
      console.log('isSeen', payload);
      store.dispatch(makeMessagesSeen(payload));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', { message });
    } else {
      console.error('Socket is not initialized');
    }
  };

  const seenMessage = ({ recipientId, chatId, senderId }) => {
    if (socketRef.current) {
      socketRef.current.emit('messageSeen', {
        recipientId,
        chatId,
        senderId,
      });
    }
  };

  return { sendMessage, seenMessage, socketRef: socketRef.current };
};

export default useWebSocket;