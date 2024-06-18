"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./src/modules/chat/chatSlice.js":
/*!***************************************!*\
  !*** ./src/modules/chat/chatSlice.js ***!
  \***************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"addMessage\": function() { return /* binding */ addMessage; },\n/* harmony export */   \"appChatSlice\": function() { return /* binding */ appChatSlice; },\n/* harmony export */   \"createChat\": function() { return /* binding */ createChat; },\n/* harmony export */   \"fetchChatsContacts\": function() { return /* binding */ fetchChatsContacts; },\n/* harmony export */   \"fetchUserProfile\": function() { return /* binding */ fetchUserProfile; },\n/* harmony export */   \"makeMessagesSeen\": function() { return /* binding */ makeMessagesSeen; },\n/* harmony export */   \"removeSelectedChat\": function() { return /* binding */ removeSelectedChat; },\n/* harmony export */   \"selectChat\": function() { return /* binding */ selectChat; },\n/* harmony export */   \"sendMsg\": function() { return /* binding */ sendMsg; }\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @reduxjs/toolkit */ \"./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js\");\n/* harmony import */ var _utils_socket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/socket */ \"./src/utils/socket.js\");\n/* harmony import */ var _utils_axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/axios */ \"./src/utils/axios.js\");\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ \"./node_modules/react-redux/es/index.js\");\n\n\n\n\nconst createChat = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.createAsyncThunk)(\"appChat/createChat\", async (id, param)=>{\n    let { dispatch  } = param;\n    try {\n        const response = await _utils_axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"].post(\"/chat/createchat\", {\n            user_id: id\n        });\n        return await dispatch(selectChat(response.data.result.id));\n    } catch (error) {\n        console.log(\"error\", error);\n    }\n});\nconst fetchUserProfile = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.createAsyncThunk)(\"appChat/fetchUserProfile\", async ()=>{\n    const { data  } = await _utils_axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get(\"/users/me\");\n    console.log(\"response\", data.user.id);\n    return {\n        id: data.user.id,\n        avatar: null,\n        fullName: data.user.first_name,\n        status: \"offline\"\n    };\n});\nconst fetchChatsContacts = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.createAsyncThunk)(\"appChat/fetchChatsContacts\", async ()=>{\n    const response = await _utils_axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get(\"/chat/getContacts\");\n    return {\n        chatsContacts: response.data.chatsContacts,\n        contacts: response.data.contacts\n    };\n});\nconst selectChat = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.createAsyncThunk)(\"appChat/selectChat\", async (id, param)=>{\n    let { dispatch , getState  } = param;\n    // Uncomment when you are ready to fetch messages\n    const response = await _utils_axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get(\"/chat/getMessages/\".concat(id));\n    await dispatch(fetchChatsContacts());\n    return response.data;\n});\nconst sendMsg = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.createAsyncThunk)(\"appChat/sendMsg\", async (obj, param)=>{\n    let { dispatch  } = param;\n    const userId = JSON.parse(localStorage.getItem(\"userData\")).id;\n    (0,_utils_socket__WEBPACK_IMPORTED_MODULE_0__.sendMessage)({\n        message: obj.message,\n        chatId: obj.chat.id,\n        recipientId: userId,\n        otherUser: obj.contact.id\n    });\n});\nconst appChatSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.createSlice)({\n    name: \"appChat\",\n    initialState: {\n        chats: null,\n        contacts: null,\n        userProfile: null,\n        selectedChat: null\n    },\n    reducers: {\n        removeSelectedChat: (state)=>{\n            state.selectedChat = null;\n        },\n        addMessage: (state, action)=>{\n            var _currentState_chat, _action_payload;\n            console.log(\"payload \", action.payload);\n            const { chatId , message  } = action.payload;\n            const hm = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.current)(state);\n            const currentState = hm.selectedChat;\n            const selectedChat = {\n                ...currentState\n            };\n            // if (currentState?.chat?.id === message.chatId) {\n            // }\n            if ((currentState === null || currentState === void 0 ? void 0 : (_currentState_chat = currentState.chat) === null || _currentState_chat === void 0 ? void 0 : _currentState_chat.id) === (action === null || action === void 0 ? void 0 : (_action_payload = action.payload) === null || _action_payload === void 0 ? void 0 : _action_payload.chatId)) {\n                const selectedChat = {\n                    ...currentState\n                };\n                // console.log(selectedChat.chat.chat.push(message));\n                state.selectedChat = {\n                    ...selectedChat,\n                    chat: {\n                        ...selectedChat.chat,\n                        chat: [\n                            ...selectedChat.chat.chat,\n                            action.payload\n                        ]\n                    }\n                };\n                // If the recipient has the chat open, emit the 'isSeen' event\n                (0,_utils_socket__WEBPACK_IMPORTED_MODULE_0__.dekhLiya)({\n                    recipientId: hm.selectedChat.contact.id,\n                    chatId: chatId,\n                    senderId: action.payload.senderId,\n                    isTrue: true\n                });\n            // seenMessage({recipientId: selectedChat.contact.id, chatId: chatId, senderId: userData?.id})\n            } else {\n                let updatedChats = hm.chats.map((chat)=>{\n                    if (chat.chat.id === chatId) {\n                        return {\n                            ...chat,\n                            chat: {\n                                ...chat.chat,\n                                lastMessage: action.payload\n                            }\n                        };\n                    }\n                    return chat;\n                });\n                state.chats = updatedChats;\n            //make this chat at the top\n            // let updatedContacts = hm.contacts.map((contact) => {\n            //   if (contact.id === action.payload.contact.id) {\n            //     return {\n            //       ...contact,\n            //       chat: {\n            //         ...contact.chat,\n            //         lastMessage: action.payload,\n            //       }\n            //     };\n            //   }\n            //   return contact;\n            // });\n            }\n        },\n        makeMessagesSeen: (state, action)=>{\n            var _currentState_selectedChat, _currentState_selectedChat_chat;\n            const { chatId , senderId , recipientId  } = action.payload;\n            const currentState = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.current)(state);\n            // Update selectedChat messages if the chatId matches\n            if (((_currentState_selectedChat = currentState.selectedChat) === null || _currentState_selectedChat === void 0 ? void 0 : (_currentState_selectedChat_chat = _currentState_selectedChat.chat) === null || _currentState_selectedChat_chat === void 0 ? void 0 : _currentState_selectedChat_chat.id) === chatId) {\n                const updatedMessages = currentState.selectedChat.chat.chat.map((message)=>message.senderId === recipientId ? {\n                        ...message,\n                        feedback: {\n                            ...message.feedback,\n                            isSeen: true\n                        }\n                    } : message);\n                state.selectedChat = {\n                    ...currentState.selectedChat,\n                    chat: {\n                        ...currentState.selectedChat.chat,\n                        chat: updatedMessages\n                    }\n                };\n            }\n        // Update the last message in the chats array if the chatId matches\n        // let idk = currentState.chats.map((chat) =>\n        //   chat.chat.id === chatId\n        //     ? {\n        //         ...chat,\n        //         chat: {\n        //           ...chat.chat,\n        //           lastMessage: {\n        //             ...chat.chat.lastMessage,\n        //             isSeen: true,\n        //           },\n        //         },\n        //       }\n        //     : chat\n        // );\n        // state.chats = idk;\n        }\n    },\n    extraReducers: (builder)=>{\n        builder.addCase(fetchUserProfile.fulfilled, (state, action)=>{\n            state.userProfile = action.payload;\n        });\n        builder.addCase(fetchChatsContacts.fulfilled, (state, action)=>{\n            state.contacts = action.payload.contacts;\n            state.chats = action.payload.chatsContacts;\n        });\n        builder.addCase(selectChat.fulfilled, (state, action)=>{\n            state.selectedChat = action.payload;\n        });\n    }\n});\nconst { removeSelectedChat , addMessage , makeMessagesSeen  } = appChatSlice.actions;\n/* harmony default export */ __webpack_exports__[\"default\"] = (appChatSlice.reducer);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cUI7UUFDdkI7SUFDRjtJQUNBRyxlQUFlLENBQUNDLFVBQVk7UUFDMUJBLFFBQVFDLE9BQU8sQ0FBQ2pELGlCQUFpQmtELFNBQVMsRUFBRSxDQUFDbEIsT0FBT0UsU0FBVztZQUM3REYsTUFBTUosV0FBVyxHQUFHTSxPQUFPRSxPQUFPO1FBQ3BDO1FBQ0FZLFFBQVFDLE9BQU8sQ0FBQzFDLG1CQUFtQjJDLFNBQVMsRUFBRSxDQUFDbEIsT0FBT0UsU0FBVztZQUMvREYsTUFBTXZCLFFBQVEsR0FBR3lCLE9BQU9FLE9BQU8sQ0FBQzNCLFFBQVE7WUFDeEN1QixNQUFNTCxLQUFLLEdBQUdPLE9BQU9FLE9BQU8sQ0FBQzVCLGFBQWE7UUFDNUM7UUFDQXdDLFFBQVFDLE9BQU8sQ0FBQ3ZELFdBQVd3RCxTQUFTLEVBQUUsQ0FBQ2xCLE9BQU9FLFNBQVc7WUFDdkRGLE1BQU1ILFlBQVksR0FBR0ssT0FBT0UsT0FBTztRQUNyQztJQUNGO0FBQ0YsR0FBRztBQUVJLE1BQU0sRUFBRUwsbUJBQWtCLEVBQUVFLFdBQVUsRUFBRVUsaUJBQWdCLEVBQUUsR0FDL0RuQixhQUFhMkIsT0FBTyxDQUFDO0FBRXZCLCtEQUFlM0IsYUFBYTRCLE9BQU8sRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvbW9kdWxlcy9jaGF0L2NoYXRTbGljZS5qcz83YTU4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNsaWNlLCBjcmVhdGVBc3luY1RodW5rLCBjdXJyZW50IH0gZnJvbSBcIkByZWR1eGpzL3Rvb2xraXRcIjtcbmltcG9ydCB7IHNlbmRNZXNzYWdlLCBzZWVuTWVzc2FnZSxkZWtoTGl5YSB9IGZyb20gXCIuLi8uLi91dGlscy9zb2NrZXRcIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiLi4vLi4vdXRpbHMvYXhpb3NcIjtcbmltcG9ydCB7IHVzZURpc3BhdGNoIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVDaGF0ID0gY3JlYXRlQXN5bmNUaHVuayhcbiAgXCJhcHBDaGF0L2NyZWF0ZUNoYXRcIixcbiAgYXN5bmMgKGlkLCB7IGRpc3BhdGNoIH0pID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KGAvY2hhdC9jcmVhdGVjaGF0YCwge1xuICAgICAgICB1c2VyX2lkOiBpZCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGF3YWl0IGRpc3BhdGNoKHNlbGVjdENoYXQocmVzcG9uc2UuZGF0YS5yZXN1bHQuaWQpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvcik7XG4gICAgfVxuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hVc2VyUHJvZmlsZSA9IGNyZWF0ZUFzeW5jVGh1bmsoXG4gIFwiYXBwQ2hhdC9mZXRjaFVzZXJQcm9maWxlXCIsXG4gIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGF4aW9zLmdldChcIi91c2Vycy9tZVwiKTtcbiAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlXCIsIGRhdGEudXNlci5pZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBkYXRhLnVzZXIuaWQsXG4gICAgICBhdmF0YXI6IG51bGwsXG4gICAgICBmdWxsTmFtZTogZGF0YS51c2VyLmZpcnN0X25hbWUsXG4gICAgICBzdGF0dXM6IFwib2ZmbGluZVwiLFxuICAgIH07XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBmZXRjaENoYXRzQ29udGFjdHMgPSBjcmVhdGVBc3luY1RodW5rKFxuICBcImFwcENoYXQvZmV0Y2hDaGF0c0NvbnRhY3RzXCIsXG4gIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChcIi9jaGF0L2dldENvbnRhY3RzXCIpO1xuICAgIHJldHVybiB7XG4gICAgICBjaGF0c0NvbnRhY3RzOiByZXNwb25zZS5kYXRhLmNoYXRzQ29udGFjdHMsXG4gICAgICBjb250YWN0czogcmVzcG9uc2UuZGF0YS5jb250YWN0cyxcbiAgICB9O1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0Q2hhdCA9IGNyZWF0ZUFzeW5jVGh1bmsoXG4gIFwiYXBwQ2hhdC9zZWxlY3RDaGF0XCIsXG4gIGFzeW5jIChpZCwgeyBkaXNwYXRjaCwgZ2V0U3RhdGUgfSkgPT4ge1xuICAgIC8vIFVuY29tbWVudCB3aGVuIHlvdSBhcmUgcmVhZHkgdG8gZmV0Y2ggbWVzc2FnZXNcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgL2NoYXQvZ2V0TWVzc2FnZXMvJHtpZH1gKTtcbiAgICBhd2FpdCBkaXNwYXRjaChmZXRjaENoYXRzQ29udGFjdHMoKSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cbik7XG5leHBvcnQgY29uc3Qgc2VuZE1zZyA9IGNyZWF0ZUFzeW5jVGh1bmsoXG4gIFwiYXBwQ2hhdC9zZW5kTXNnXCIsXG4gIGFzeW5jIChvYmosIHsgZGlzcGF0Y2ggfSkgPT4ge1xuICAgIGNvbnN0IHVzZXJJZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VyRGF0YVwiKSkuaWQ7XG4gICAgc2VuZE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogb2JqLm1lc3NhZ2UsXG4gICAgICBjaGF0SWQ6IG9iai5jaGF0LmlkLFxuICAgICAgcmVjaXBpZW50SWQ6IHVzZXJJZCxcbiAgICAgIG90aGVyVXNlcjogb2JqLmNvbnRhY3QuaWQsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBhcHBDaGF0U2xpY2UgPSBjcmVhdGVTbGljZSh7XG4gIG5hbWU6IFwiYXBwQ2hhdFwiLFxuICBpbml0aWFsU3RhdGU6IHtcbiAgICBjaGF0czogbnVsbCxcbiAgICBjb250YWN0czogbnVsbCxcbiAgICB1c2VyUHJvZmlsZTogbnVsbCxcbiAgICBzZWxlY3RlZENoYXQ6IG51bGwsXG4gIH0sXG4gIHJlZHVjZXJzOiB7XG4gICAgcmVtb3ZlU2VsZWN0ZWRDaGF0OiAoc3RhdGUpID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdGVkQ2hhdCA9IG51bGw7XG4gICAgfSxcbiAgICBhZGRNZXNzYWdlOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJwYXlsb2FkIFwiLCBhY3Rpb24ucGF5bG9hZCk7XG5cbiAgICAgIGNvbnN0IHsgY2hhdElkLCBtZXNzYWdlIH0gPSBhY3Rpb24ucGF5bG9hZDtcblxuICAgICAgY29uc3QgaG0gPSBjdXJyZW50KHN0YXRlKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGhtLnNlbGVjdGVkQ2hhdDtcbiAgICAgIGNvbnN0IHNlbGVjdGVkQ2hhdCA9IHsgLi4uY3VycmVudFN0YXRlIH07XG5cbiAgICAgIC8vIGlmIChjdXJyZW50U3RhdGU/LmNoYXQ/LmlkID09PSBtZXNzYWdlLmNoYXRJZCkge1xuXG4gICAgICAvLyB9XG5cbiAgICAgIGlmIChjdXJyZW50U3RhdGU/LmNoYXQ/LmlkID09PSBhY3Rpb24/LnBheWxvYWQ/LmNoYXRJZCkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZENoYXQgPSB7IC4uLmN1cnJlbnRTdGF0ZSB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3RlZENoYXQuY2hhdC5jaGF0LnB1c2gobWVzc2FnZSkpO1xuICAgICAgICBzdGF0ZS5zZWxlY3RlZENoYXQgPSB7XG4gICAgICAgICAgLi4uc2VsZWN0ZWRDaGF0LFxuICAgICAgICAgIGNoYXQ6IHtcbiAgICAgICAgICAgIC4uLnNlbGVjdGVkQ2hhdC5jaGF0LFxuICAgICAgICAgICAgY2hhdDogWy4uLnNlbGVjdGVkQ2hhdC5jaGF0LmNoYXQsIGFjdGlvbi5wYXlsb2FkXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICAvLyBJZiB0aGUgcmVjaXBpZW50IGhhcyB0aGUgY2hhdCBvcGVuLCBlbWl0IHRoZSAnaXNTZWVuJyBldmVudFxuICAgICAgICBkZWtoTGl5YSh7XG4gICAgICAgICAgcmVjaXBpZW50SWQ6IGhtLnNlbGVjdGVkQ2hhdC5jb250YWN0LmlkLFxuICAgICAgICAgIGNoYXRJZDogY2hhdElkLFxuICAgICAgICAgIHNlbmRlcklkOiBhY3Rpb24ucGF5bG9hZC5zZW5kZXJJZCxcbiAgICAgICAgICBpc1RydWU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNlZW5NZXNzYWdlKHtyZWNpcGllbnRJZDogc2VsZWN0ZWRDaGF0LmNvbnRhY3QuaWQsIGNoYXRJZDogY2hhdElkLCBzZW5kZXJJZDogdXNlckRhdGE/LmlkfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVkQ2hhdHMgPSBobS5jaGF0cy5tYXAoKGNoYXQpID0+IHtcbiAgICAgICAgICBpZiAoY2hhdC5jaGF0LmlkID09PSBjaGF0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmNoYXQsXG4gICAgICAgICAgICAgIGNoYXQ6IHtcbiAgICAgICAgICAgICAgICAuLi5jaGF0LmNoYXQsXG4gICAgICAgICAgICAgICAgbGFzdE1lc3NhZ2U6IGFjdGlvbi5wYXlsb2FkLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoYXQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YXRlLmNoYXRzID0gdXBkYXRlZENoYXRzO1xuXG4gICAgICAgIC8vbWFrZSB0aGlzIGNoYXQgYXQgdGhlIHRvcFxuICAgICAgICAvLyBsZXQgdXBkYXRlZENvbnRhY3RzID0gaG0uY29udGFjdHMubWFwKChjb250YWN0KSA9PiB7XG4gICAgICAgIC8vICAgaWYgKGNvbnRhY3QuaWQgPT09IGFjdGlvbi5wYXlsb2FkLmNvbnRhY3QuaWQpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiB7XG4gICAgICAgIC8vICAgICAgIC4uLmNvbnRhY3QsXG4gICAgICAgIC8vICAgICAgIGNoYXQ6IHtcbiAgICAgICAgLy8gICAgICAgICAuLi5jb250YWN0LmNoYXQsXG4gICAgICAgIC8vICAgICAgICAgbGFzdE1lc3NhZ2U6IGFjdGlvbi5wYXlsb2FkLFxuICAgICAgICAvLyAgICAgICB9XG4gICAgICAgIC8vICAgICB9O1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gICByZXR1cm4gY29udGFjdDtcbiAgICAgICAgLy8gfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBtYWtlTWVzc2FnZXNTZWVuOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgY29uc3QgeyBjaGF0SWQsIHNlbmRlcklkLHJlY2lwaWVudElkIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnQoc3RhdGUpO1xuXG4gICAgICAvLyBVcGRhdGUgc2VsZWN0ZWRDaGF0IG1lc3NhZ2VzIGlmIHRoZSBjaGF0SWQgbWF0Y2hlc1xuICAgICAgaWYgKGN1cnJlbnRTdGF0ZS5zZWxlY3RlZENoYXQ/LmNoYXQ/LmlkID09PSBjaGF0SWQpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlZE1lc3NhZ2VzID0gY3VycmVudFN0YXRlLnNlbGVjdGVkQ2hhdC5jaGF0LmNoYXQubWFwKFxuICAgICAgICAgIChtZXNzYWdlKSA9PlxuICAgICAgICAgICAgbWVzc2FnZS5zZW5kZXJJZCA9PT0gcmVjaXBpZW50SWRcbiAgICAgICAgICAgICAgPyB7IC4uLm1lc3NhZ2UsIGZlZWRiYWNrIDp7XG4gICAgICAgICAgICAgICAgLi4ubWVzc2FnZS5mZWVkYmFjayxcbiAgICAgICAgICAgICAgICBpc1NlZW46IHRydWUsXG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgICA6IG1lc3NhZ2VcbiAgICAgICAgKTtcblxuICAgICAgICBzdGF0ZS5zZWxlY3RlZENoYXQgPSB7XG4gICAgICAgICAgLi4uY3VycmVudFN0YXRlLnNlbGVjdGVkQ2hhdCxcbiAgICAgICAgICBjaGF0OiB7XG4gICAgICAgICAgICAuLi5jdXJyZW50U3RhdGUuc2VsZWN0ZWRDaGF0LmNoYXQsXG4gICAgICAgICAgICBjaGF0OiB1cGRhdGVkTWVzc2FnZXMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gVXBkYXRlIHRoZSBsYXN0IG1lc3NhZ2UgaW4gdGhlIGNoYXRzIGFycmF5IGlmIHRoZSBjaGF0SWQgbWF0Y2hlc1xuICAgICAgLy8gbGV0IGlkayA9IGN1cnJlbnRTdGF0ZS5jaGF0cy5tYXAoKGNoYXQpID0+XG4gICAgICAvLyAgIGNoYXQuY2hhdC5pZCA9PT0gY2hhdElkXG4gICAgICAvLyAgICAgPyB7XG4gICAgICAvLyAgICAgICAgIC4uLmNoYXQsXG4gICAgICAvLyAgICAgICAgIGNoYXQ6IHtcbiAgICAgIC8vICAgICAgICAgICAuLi5jaGF0LmNoYXQsXG4gICAgICAvLyAgICAgICAgICAgbGFzdE1lc3NhZ2U6IHtcbiAgICAgIC8vICAgICAgICAgICAgIC4uLmNoYXQuY2hhdC5sYXN0TWVzc2FnZSxcbiAgICAgIC8vICAgICAgICAgICAgIGlzU2VlbjogdHJ1ZSxcbiAgICAgIC8vICAgICAgICAgICB9LFxuICAgICAgLy8gICAgICAgICB9LFxuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgIDogY2hhdFxuICAgICAgLy8gKTtcbiAgICAgIC8vIHN0YXRlLmNoYXRzID0gaWRrO1xuICAgIH0sXG4gIH0sXG4gIGV4dHJhUmVkdWNlcnM6IChidWlsZGVyKSA9PiB7XG4gICAgYnVpbGRlci5hZGRDYXNlKGZldGNoVXNlclByb2ZpbGUuZnVsZmlsbGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgc3RhdGUudXNlclByb2ZpbGUgPSBhY3Rpb24ucGF5bG9hZDtcbiAgICB9KTtcbiAgICBidWlsZGVyLmFkZENhc2UoZmV0Y2hDaGF0c0NvbnRhY3RzLmZ1bGZpbGxlZCwgKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgIHN0YXRlLmNvbnRhY3RzID0gYWN0aW9uLnBheWxvYWQuY29udGFjdHM7XG4gICAgICBzdGF0ZS5jaGF0cyA9IGFjdGlvbi5wYXlsb2FkLmNoYXRzQ29udGFjdHM7XG4gICAgfSk7XG4gICAgYnVpbGRlci5hZGRDYXNlKHNlbGVjdENoYXQuZnVsZmlsbGVkLCAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0ZWRDaGF0ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgfSk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGNvbnN0IHsgcmVtb3ZlU2VsZWN0ZWRDaGF0LCBhZGRNZXNzYWdlLCBtYWtlTWVzc2FnZXNTZWVuIH0gPVxuICBhcHBDaGF0U2xpY2UuYWN0aW9ucztcblxuZXhwb3J0IGRlZmF1bHQgYXBwQ2hhdFNsaWNlLnJlZHVjZXI7XG4iXSwibmFtZXMiOlsiY3JlYXRlU2xpY2UiLCJjcmVhdGVBc3luY1RodW5rIiwiY3VycmVudCIsInNlbmRNZXNzYWdlIiwic2Vlbk1lc3NhZ2UiLCJkZWtoTGl5YSIsImF4aW9zIiwidXNlRGlzcGF0Y2giLCJjcmVhdGVDaGF0IiwiaWQiLCJkaXNwYXRjaCIsInJlc3BvbnNlIiwicG9zdCIsInVzZXJfaWQiLCJzZWxlY3RDaGF0IiwiZGF0YSIsInJlc3VsdCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImZldGNoVXNlclByb2ZpbGUiLCJnZXQiLCJ1c2VyIiwiYXZhdGFyIiwiZnVsbE5hbWUiLCJmaXJzdF9uYW1lIiwic3RhdHVzIiwiZmV0Y2hDaGF0c0NvbnRhY3RzIiwiY2hhdHNDb250YWN0cyIsImNvbnRhY3RzIiwiZ2V0U3RhdGUiLCJzZW5kTXNnIiwib2JqIiwidXNlcklkIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIm1lc3NhZ2UiLCJjaGF0SWQiLCJjaGF0IiwicmVjaXBpZW50SWQiLCJvdGhlclVzZXIiLCJjb250YWN0IiwiYXBwQ2hhdFNsaWNlIiwibmFtZSIsImluaXRpYWxTdGF0ZSIsImNoYXRzIiwidXNlclByb2ZpbGUiLCJzZWxlY3RlZENoYXQiLCJyZWR1Y2VycyIsInJlbW92ZVNlbGVjdGVkQ2hhdCIsInN0YXRlIiwiYWRkTWVzc2FnZSIsImFjdGlvbiIsImN1cnJlbnRTdGF0ZSIsInBheWxvYWQiLCJobSIsInNlbmRlcklkIiwiaXNUcnVlIiwidXBkYXRlZENoYXRzIiwibWFwIiwibGFzdE1lc3NhZ2UiLCJtYWtlTWVzc2FnZXNTZWVuIiwidXBkYXRlZE1lc3NhZ2VzIiwiZmVlZGJhY2siLCJpc1NlZW4iLCJleHRyYVJlZHVjZXJzIiwiYnVpbGRlciIsImFkZENhc2UiLCJmdWxmaWxsZWQiLCJhY3Rpb25zIiwicmVkdWNlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/chat/chatSlice.js\n"));

/***/ })

});