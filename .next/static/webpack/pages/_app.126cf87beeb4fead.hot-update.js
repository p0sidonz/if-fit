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

/***/ "./src/utils/socket.js":
/*!*****************************!*\
  !*** ./src/utils/socket.js ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"seenMessage\": function() { return /* binding */ seenMessage; },\n/* harmony export */   \"sendMessage\": function() { return /* binding */ sendMessage; }\n/* harmony export */ });\n/* harmony import */ var _modules_consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/consts */ \"./src/modules/consts.js\");\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io-client */ \"./node_modules/socket.io-client/build/esm/index.js\");\n/* harmony import */ var _modules_chat_chatSlice__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/chat/chatSlice */ \"./src/modules/chat/chatSlice.js\");\n/* harmony import */ var src_store_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/store/store */ \"./src/store/store.js\");\n\n\n\n\nlet socket;\nif (true) {\n    // Code to run only on the client side\n    const token = localStorage.getItem(\"accessToken\");\n    socket = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_1__.io)(_modules_consts__WEBPACK_IMPORTED_MODULE_0__.API_URL, {\n        extraHeaders: {\n            Authorization: \"Bearer \".concat(token)\n        }\n    });\n    socket.on(\"connect\", ()=>{\n        console.log(\"Connected to WebSocket server\");\n    });\n    socket.on(\"disconnect\", ()=>{\n        console.log(\"Disconnected from WebSocket server\");\n    });\n    socket.on(\"isSeen\", (payload)=>{\n        console.log(\"isSeen\", payload);\n        src_store_store__WEBPACK_IMPORTED_MODULE_3__[\"default\"].dispatch((0,_modules_chat_chatSlice__WEBPACK_IMPORTED_MODULE_2__.makeMessagesSeen)(payload));\n    });\n}\nconst sendMessage = (message)=>{\n    if (socket) {\n        socket.emit(\"sendMessage\", {\n            message\n        });\n    } else {\n        console.error(\"Socket is not initialized\");\n    }\n};\nconst seenMessage = (param)=>{\n    let { recipientId , chatId , senderId , isTrue  } = param;\n    if (socket) {\n        socket.emit(\"messageSeen\", {\n            recipientId,\n            chatId,\n            senderId\n        });\n    }\n};\n// export const dekhLiya = ({ recipientId, chatId, senderId, isTrue }) => {\n//   console.log(\"dekhLiya\", recipientId, chatId, senderId)\n//   if (socket) {\n//     socket.emit(\"messageSeen\", {\n//       kiskobtanahaiwaps: senderId ,\n//       chatId,\n//       kisneYeEmitKiyaHai: recipientId,\n//       isTrue: isTrue,\n//     });\n//   }\n// };\n/* harmony default export */ __webpack_exports__[\"default\"] = (socket);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvc29ja2V0LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUE0QztBQUNOO0FBQ3VCO0FBQ3pCO0FBQ3BDLElBQUlJO0FBRUosSUFBSSxJQUE2QixFQUFFO0lBQ2pDLHNDQUFzQztJQUN0QyxNQUFNQyxRQUFRQyxhQUFhQyxPQUFPLENBQUM7SUFFbkNILFNBQVNILG9EQUFFQSxDQUFDRCxvREFBT0EsRUFBRTtRQUNuQlEsY0FBYztZQUNaQyxlQUFlLFVBQWdCLE9BQU5KO1FBQzNCO0lBQ0Y7SUFFQUQsT0FBT00sRUFBRSxDQUFDLFdBQVcsSUFBTTtRQUN6QkMsUUFBUUMsR0FBRyxDQUFDO0lBQ2Q7SUFFQVIsT0FBT00sRUFBRSxDQUFDLGNBQWMsSUFBTTtRQUM1QkMsUUFBUUMsR0FBRyxDQUFDO0lBQ2Q7SUFFQVIsT0FBT00sRUFBRSxDQUFDLFVBQVUsQ0FBQ0csVUFBWTtRQUMvQkYsUUFBUUMsR0FBRyxDQUFDLFVBQVVDO1FBQ3RCVixnRUFBYyxDQUFDRCx5RUFBZ0JBLENBQUNXO0lBQ2xDO0FBQ0YsQ0FBQztBQUVNLE1BQU1FLGNBQWMsQ0FBQ0MsVUFBWTtJQUN0QyxJQUFJWixRQUFRO1FBQ1ZBLE9BQU9hLElBQUksQ0FBQyxlQUFlO1lBQ3pCRDtRQUNGO0lBQ0YsT0FBTztRQUNMTCxRQUFRTyxLQUFLLENBQUM7SUFDaEIsQ0FBQztBQUNILEVBQUU7QUFFSyxNQUFNQyxjQUFjLFNBQThDO1FBQTdDLEVBQUVDLFlBQVcsRUFBRUMsT0FBTSxFQUFFQyxTQUFRLEVBQUVDLE9BQU0sRUFBQztJQUNsRSxJQUFJbkIsUUFBUTtRQUNWQSxPQUFPYSxJQUFJLENBQUMsZUFBZTtZQUN6Qkc7WUFDQUM7WUFDQUM7UUFDRjtJQUNGLENBQUM7QUFDSCxFQUFFO0FBRUYsMkVBQTJFO0FBQzNFLDJEQUEyRDtBQUMzRCxrQkFBa0I7QUFDbEIsbUNBQW1DO0FBQ25DLHNDQUFzQztBQUN0QyxnQkFBZ0I7QUFDaEIseUNBQXlDO0FBQ3pDLHdCQUF3QjtBQUN4QixVQUFVO0FBQ1YsTUFBTTtBQUNOLEtBQUs7QUFFTCwrREFBZWxCLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL3V0aWxzL3NvY2tldC5qcz85MDkzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSV9VUkwgfSBmcm9tIFwiLi4vbW9kdWxlcy9jb25zdHNcIjtcbmltcG9ydCB7IGlvIH0gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcbmltcG9ydCB7IG1ha2VNZXNzYWdlc1NlZW4gfSBmcm9tIFwiLi4vbW9kdWxlcy9jaGF0L2NoYXRTbGljZVwiO1xuaW1wb3J0IHN0b3JlIGZyb20gXCJzcmMvc3RvcmUvc3RvcmVcIjtcbmxldCBzb2NrZXQ7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIC8vIENvZGUgdG8gcnVuIG9ubHkgb24gdGhlIGNsaWVudCBzaWRlXG4gIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2Nlc3NUb2tlblwiKTtcblxuICBzb2NrZXQgPSBpbyhBUElfVVJMLCB7XG4gICAgZXh0cmFIZWFkZXJzOiB7XG4gICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dG9rZW59YCxcbiAgICB9LFxuICB9KTtcblxuICBzb2NrZXQub24oXCJjb25uZWN0XCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RlZCB0byBXZWJTb2NrZXQgc2VydmVyXCIpO1xuICB9KTtcblxuICBzb2NrZXQub24oXCJkaXNjb25uZWN0XCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkRpc2Nvbm5lY3RlZCBmcm9tIFdlYlNvY2tldCBzZXJ2ZXJcIik7XG4gIH0pO1xuXG4gIHNvY2tldC5vbihcImlzU2VlblwiLCAocGF5bG9hZCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiaXNTZWVuXCIsIHBheWxvYWQpO1xuICAgIHN0b3JlLmRpc3BhdGNoKG1ha2VNZXNzYWdlc1NlZW4ocGF5bG9hZCkpO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHNlbmRNZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgaWYgKHNvY2tldCkge1xuICAgIHNvY2tldC5lbWl0KFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgbWVzc2FnZSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiU29ja2V0IGlzIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNlZW5NZXNzYWdlID0gKHsgcmVjaXBpZW50SWQsIGNoYXRJZCwgc2VuZGVySWQsIGlzVHJ1ZX0pID0+IHtcbiAgaWYgKHNvY2tldCkge1xuICAgIHNvY2tldC5lbWl0KFwibWVzc2FnZVNlZW5cIiwge1xuICAgICAgcmVjaXBpZW50SWQsXG4gICAgICBjaGF0SWQsXG4gICAgICBzZW5kZXJJZCxcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gZXhwb3J0IGNvbnN0IGRla2hMaXlhID0gKHsgcmVjaXBpZW50SWQsIGNoYXRJZCwgc2VuZGVySWQsIGlzVHJ1ZSB9KSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKFwiZGVraExpeWFcIiwgcmVjaXBpZW50SWQsIGNoYXRJZCwgc2VuZGVySWQpXG4vLyAgIGlmIChzb2NrZXQpIHtcbi8vICAgICBzb2NrZXQuZW1pdChcIm1lc3NhZ2VTZWVuXCIsIHtcbi8vICAgICAgIGtpc2tvYnRhbmFoYWl3YXBzOiBzZW5kZXJJZCAsXG4vLyAgICAgICBjaGF0SWQsXG4vLyAgICAgICBraXNuZVllRW1pdEtpeWFIYWk6IHJlY2lwaWVudElkLFxuLy8gICAgICAgaXNUcnVlOiBpc1RydWUsXG4vLyAgICAgfSk7XG4vLyAgIH1cbi8vIH07XG5cbmV4cG9ydCBkZWZhdWx0IHNvY2tldDtcbiJdLCJuYW1lcyI6WyJBUElfVVJMIiwiaW8iLCJtYWtlTWVzc2FnZXNTZWVuIiwic3RvcmUiLCJzb2NrZXQiLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJleHRyYUhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwib24iLCJjb25zb2xlIiwibG9nIiwicGF5bG9hZCIsImRpc3BhdGNoIiwic2VuZE1lc3NhZ2UiLCJtZXNzYWdlIiwiZW1pdCIsImVycm9yIiwic2Vlbk1lc3NhZ2UiLCJyZWNpcGllbnRJZCIsImNoYXRJZCIsInNlbmRlcklkIiwiaXNUcnVlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/utils/socket.js\n"));

/***/ })

});