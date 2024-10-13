import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { sendMessage, seenMessage } from "../../utils/socket";
import axios from "../../utils/axios";
import { useDispatch } from "react-redux";

export const createChat = createAsyncThunk(
  "appChat/createChat",
  async (id, { dispatch }) => {
    try {
      const response = await axios.post(`/chat/createchat`, {
        user_id: id,
      });
      return await dispatch(selectChat(response.data.result.id));
    } catch (error) {
      console.log("error", error);
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
  async (obj, { dispatch }) => {
    const userId = JSON.parse(localStorage.getItem("userData")).id;
    sendMessage({
      message: obj.message,
      chatId: obj.chat.id,
      recipientId: userId,
      otherUser: obj.contact.id,
    });
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
      console.log("payload ", action.payload);

      const { chatId, message } = action.payload;

      const hm = current(state);
      const currentState = hm.selectedChat;
      const selectedChat = { ...currentState };

      // if (currentState?.chat?.id === message.chatId) {

      // }

      if (currentState?.chat?.id === action?.payload?.chatId) {
        const selectedChat = { ...currentState };
        // console.log(selectedChat.chat.chat.push(message));
        state.selectedChat = {
          ...selectedChat,
          chat: {
            ...selectedChat.chat,
            chat: [...selectedChat.chat.chat, action.payload],
          },
        };
        // If the recipient has the chat open, emit the 'isSeen' event
        seenMessage({
          recipientId: hm.selectedChat.contact.id,
          chatId: chatId,
          senderId: action.payload.senderId,
          isTrue: true,
        });

        let updatedChats = hm.chats.map((chat) => {
          if (chat.chat.id === chatId) {
            return {
              ...chat,
              chat: {
                ...chat.chat,
                lastMessage: action.payload,
              },
            };
          }
          return chat;
        });

        state.chats = updatedChats;


      } else {

        let updatedChats = hm.chats.map((chat) => {
          if (chat.chat.id === chatId) {
            return {
              ...chat,
              chat: {
                ...chat.chat,
                lastMessage: action.payload,
              },
            };
          }
          return chat;
        });
        state.chats = updatedChats;
        //make this chat at the top
        // let updatedContacts = hm.contacts.map((contact) => {
        //   if (contact.id === action.payload.contact.id) {
        //     return {
        //       ...contact,
        //       chat: {
        //         ...contact.chat,
        //         lastMessage: action.payload,
        //       }
        //     };
        //   }
        //   return contact;
        // });
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
