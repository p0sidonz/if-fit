// ** React Imports
import { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { makeMessagesSeen } from "../modules/chat/chatSlice";
import store from "src/store/store";
import { setUserDetails } from "src/modules/user/userSlice";
import {API_URL} from "../modules/consts";
import { useDispatch } from "react-redux";
// ** Next Import
import { useRouter } from "next/router";
// ** Axios
import axios from "axios";

// ** Config
import authConfig from "src/configs/auth";
let BASE_URL = API_URL
// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  socket: null,
  seenMessage: () => null,
  sendMessage: () => null,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const dispatch = useDispatch();
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState(
    defaultProvider.isInitialized
  );
  const [socket, setSocket] = useState(null);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    const initAuth = async () => {
      setIsInitialized(true);
      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName
      );
      if (storedToken) {
        setLoading(true);
        if (!socket) {
          initializeSocket(storedToken);
        }
        await axios
          .get(BASE_URL + authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
          .then(async (response) => {
            setLoading(false);
            dispatch(setUserDetails(response.data.user));
            setUser({ ...response.data.user });
            
            // Check if on pricing page and redirect if authenticated
            if (router.pathname === '/pricing') {
              router.replace('/already');
            }
           
          })
          .catch(() => {
            localStorage.removeItem("userData");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            setUser(null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };
    initAuth();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, router]);

  const initializeSocket = (token) => {
    if (typeof window === "undefined" || !token) return;
    
    if (socket) {
      socket.disconnect();
    }

    console.log('Attempting to connect to socket at:', BASE_URL);
    
    const newSocket = io(BASE_URL, { 
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      console.error('Full error:', error);
    });

    newSocket.on('connect_timeout', () => {
      console.error('Socket connection timeout');
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("Disconnected from WebSocket server:", reason);
    });

    newSocket.on("isSeen", (payload) => {
      console.log("isSeen event received:", payload);
      store.dispatch(makeMessagesSeen(payload));
    });

    setSocket(newSocket);
    return newSocket;
  };
  
  const seenMessage = ({ recipientId, chatId, senderId }) => {
    if (socket?.connected) {
      socket.emit("messageSeen", { recipientId, chatId, senderId });
    } else {
      console.error("Cannot mark message as seen: Socket is not connected");
    }
  };


/**
 * Sends a message via the WebSocket.
 */
 const sendMessage = (message) => {
  console.log('Sending message:', message);
  if (socket?.connected) {
    socket.emit("sendMessage", { message });
  } else {
    console.error("Cannot send message: Socket is not connected");
  }
};




  const handleLogin = (params, errorCallback) => {
    console.log(BASE_URL);
    axios
      .post(BASE_URL + authConfig.loginEndpoint, params)
      .then(async (res) => {
        console.log(res.data.accessToken);
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          res.data.accessToken
        );
        await axios
          .get(BASE_URL + authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(
                authConfig.storageTokenKeyName
              )}`,
            },
          })
          .then(async (response) => {
            const returnUrl = router.query.returnUrl;
            console.log("response.data.user", response.data.user)
            dispatch(setUserDetails(response.data.user));
            setUser({ ...response.data.user });
            await window.localStorage.setItem(
              "userData",
              JSON.stringify(response.data.user)
            );
            const redirectURL =
              returnUrl && returnUrl !== "/" ? returnUrl : "/home";
            router.replace(redirectURL);
            initializeSocket(res.data.accessToken);

          });
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = (params = {}) => {
    // Handle both object parameter and direct string parameter
    const returnUrl = typeof params === 'string' ? params : (params.returnUrl || '/login');
    const callback = typeof params === 'object' ? params.callback : undefined;

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    
    router.push(returnUrl);
  };

  const handleRegister = (params, errorCallback) => {
    axios
      .post(BASE_URL + '/auth/signup', params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          // After successful registration, automatically log in the user
          handleLogin({
            email: params.email,
            password: params.password
          });
        }
      })
      .catch((err) => (errorCallback ? errorCallback(err) : null));
  };

  const handleLoginMinimal = async (params) => {
    try {
      const loginResponse = await axios.post(BASE_URL + authConfig.loginEndpoint, params);
      
      // Get user data
      const userResponse = await axios.get(BASE_URL + authConfig.meEndpoint, {
        headers: {
          Authorization: `Bearer ${loginResponse.data.accessToken}`,
        },
      });

      return {
        success: true,
        user: userResponse.data.user,
        token: loginResponse.data.accessToken
      };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Authentication failed'
      };
    }
  };

  const handleRegisterMinimal = async (params) => {
    try {
      // First register the user
      const registerResponse = await axios.post(BASE_URL + '/auth/signup', params);
      
      if (registerResponse.data.error) {
        return {
          success: false,
          error: registerResponse.data.error
        };
      }

      // If registration successful, do minimal login to get user data
      const loginResult = await handleLoginMinimal({
        email: params.email,
        password: params.password
      });

      return {
        success: true,
        user: loginResult.user,
        token: loginResult.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    socket,
    seenMessage,
    sendMessage,
    handleLoginMinimal,
    handleRegisterMinimal
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
