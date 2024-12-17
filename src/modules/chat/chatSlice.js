import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { useContext } from "react";
// import { sendMessage, seenMessage } from "../../utils/socket";
import { AuthContext } from 'src/context/AuthContext';

import axios from "../../utils/axios";
import { useDispatch } from "react-redux";

export const createChat = createAsyncThunk(
  "appChat/createChat",
  async (id, { dispatch }) => {
    try {
      const response = await axios.post(`/chat/createchat`, {
        user_id: id,
      });
      
      // Wait for selectChat to complete and pass the required parameters
      return await dispatch(selectChat({
        id: response.data.result.id,
        skip: 0,
        take: 10  // or whatever your default page size is
      })).unwrap();  // unwrap() to properly handle the promise
      
    } catch (error) {
      console.log("error", error);
      throw error;  // Re-throw the error for proper error handling
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "appChat/fetchUserProfile",
  async () => {
    const { data } = await axios.get("/users/me");
    console.log("response", data.user.id);
    return {
      id: data.user.id,
      avatar: null,
      fullName: data.user.first_name,
      status: "offline",
    };
  }
);

export const fetchChatsContacts = createAsyncThunk(
  "appChat/fetchChatsContacts",
  async () => {
    const response = await axios.get("/chat/getContacts");
    return {
      chatsContacts: response.data.chatsContacts,
      contacts: response.data.contacts,
    };
  }
);

export const selectChat = createAsyncThunk(
  "appChat/selectChat",
  async (
    params, { dispatch, getState}
  ) => {
    const  {id, skip, take} = params
    // Uncomment when you are ready to fetch messages
    const response = await axios.get(`/chat/getMessages/${id}?skip=${skip}&take=${take}`);
    await dispatch(fetchChatsContacts());
    return response.data;
  }
);
export const sendMsg = createAsyncThunk(
  "appChat/sendMsg",
  async (obj, { dispatch, getState }) => {
    const userId = JSON.parse(localStorage.getItem("userData")).id;
    const { sendMessage } = useContext(AuthContext);
    // Create message object with all necessary fields
    const messageObj = {
      message: obj.message,
      chatId: obj.chat.id,
      recipientId: obj.contact.id,
      senderId: userId,
      time: new Date().toISOString(),
      feedback: {
        isSent: true,
        isDelivered: false,
        isSeen: false
      }
    };
    // console.log("messageObj", messageObj )
    // // Dispatch addMessage action immediately for sender's UI
    // dispatch(addMessage(messageObj));

    // Send message through socket
    sendMessage({
      message: obj.message,
      chatId: obj.chat.id,
      recipientId: obj.contact.id,
      senderId: userId,
    });

    return messageObj;
  }
);

export const appChatSlice = createSlice({
  name: "appChat",
  initialState: {
    chats: null,
    contacts: null,
    userProfile: null,
    selectedChat: null,
  },
  reducers: {
    removeSelectedChat: (state) => {
      state.selectedChat = null;
    },
    addMessage: (state, action) => {
      const currentState = current(state);
      
      const messageData = action.payload;
      const chatId = messageData.chatId;

      // Check if message already exists to prevent duplicates
      const messageExists = currentState.selectedChat?.chat?.chat?.some(
        msg => msg.time === messageData.time && msg.senderId === messageData.senderId
      );

      if (messageExists) {
        return;
      }

      // Update selectedChat if it's the current chat
      if (currentState.selectedChat?.chat?.id === chatId) {
        state.selectedChat = {
          ...currentState.selectedChat,
          chat: {
            ...currentState.selectedChat.chat,
            chat: [...currentState.selectedChat.chat.chat, messageData],
          },
        };
      }

      // Update chats list
      if (currentState.chats) {
        state.chats = currentState.chats.map((chat) => {
          if (chat.chat.id === chatId) {
            return {
              ...chat,
              chat: {
                ...chat.chat,
                lastMessage: messageData
              }
            };
          }
          return chat;
        });
      }
    },
    makeMessagesSeen: (state, action) => {
      const { chatId, senderId,recipientId } = action.payload;
      const currentState = current(state);

      // Update selectedChat messages if the chatId matches
      if (currentState.selectedChat?.chat?.id === chatId) {
        const updatedMessages = currentState.selectedChat.chat.chat.map(
          (message) =>
            message.senderId === recipientId
              ? { ...message, feedback :{
                ...message.feedback,
                isSeen: true,
              } }
              : message
        );

        state.selectedChat = {
          ...currentState.selectedChat,
          chat: {
            ...currentState.selectedChat.chat,
            chat: updatedMessages,
          },
        };
      }

    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload;
    });
    builder.addCase(fetchChatsContacts.fulfilled, (state, action) => {
      state.contacts = action.payload.contacts;
      state.chats = action.payload.chatsContacts;
    });
    builder.addCase(selectChat.fulfilled, (state, action) => {
      state.selectedChat = action.payload;
    });
  },
});

export const { removeSelectedChat, addMessage, makeMessagesSeen } =
  appChatSlice.actions;

export default appChatSlice.reducer;
