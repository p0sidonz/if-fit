// ** React Imports
import { useEffect, useState, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { sendMsg, selectChat, fetchUserProfile, fetchChatsContacts, removeSelectedChat, createChat } from './chatSlice'
import { addMessage } from './chatSlice'
// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'
import { formatDateToMonthShort } from 'src/@core/utils/format'

// ** Chat App Components Imports
import SidebarLeft from './components/SidebarLeft'
import { AuthContext } from 'src/context/AuthContext';
import ChatContent from './components/ChatContent'
// import Socket from  'src/utils/socket'


// export const sendMsg = createAsyncThunk(
//   "appChat/sendMsg",
//   async (obj, { dispatch, getState }) => {
//     const userId = JSON.parse(localStorage.getItem("userData")).id;
//     const { sendMessage } = useContext(AuthContext);
//     // Create message object with all necessary fields
//     const messageObj = {
//       message: obj.message,
//       chatId: obj.chat.id,
//       recipientId: obj.contact.id,
//       senderId: userId,
//       time: new Date().toISOString(),
//       feedback: {
//         isSent: true,
//         isDelivered: false,
//         isSeen: false
//       }
//     };
//     // console.log("messageObj", messageObj )
//     // // Dispatch addMessage action immediately for sender's UI
//     // dispatch(addMessage(messageObj));

//     // Send message through socket
//     sendMessage({
//       message: obj.message,
//       chatId: obj.chat.id,
//       recipientId: obj.contact.id,
//       senderId: userId,
//     });

//     return messageObj;
//   }
// );


const AppChat = () => {
  const { sendMessage } = useContext(AuthContext);
  // ** States
  const [userStatus, setUserStatus] = useState('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector(state => state.chat)
  const { socket } = useContext(AuthContext);
  // ** Vars
  const { skin } = settings
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 370 : 300
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))

  const statusObj = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }
  useEffect(() => {
    dispatch(fetchUserProfile())
    dispatch(fetchChatsContacts())

  }, [dispatch])
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        console.log("message from socket", message);
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        // Add message to store exactly as received
        dispatch(addMessage({
          ...message,
          // Keep the original senderId (the person who sent the message)
          senderId: message.senderId,
          // Keep the original recipientId (the person receiving the message)
          recipientId: message.recipientId,
          time: message.time || new Date().toISOString(),
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: false
          }
        }));
      });

      // Cleanup socket listener on unmount
      return () => {
        socket.off('message');
      };
    }
  }, [dispatch]);


  const handleSendMessage = (message) => {
    console.log("message from handleSendMessage", message);
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    //     const messageObj = {
    //       message: obj.message,
    //       chatId: obj.chat.id,
    //       recipientId: obj.contact.id,
    //       senderId: userId,
    //       time: new Date().toISOString(),
    //       feedback: {
    //         isSent: true,
    //         isDelivered: false,
    //         isSeen: false
    //       }

    sendMessage({
      message: message.message,
      chatId: message.chat.id,
      recipientId: message.contact.id,
      senderId: currentUser.id,
      time: new Date().toISOString(),
      feedback: {
        isSent: true,
        isDelivered: false,
        isSeen: false
      }

    });
  };


  return (
    <Box
      className='app-chat'
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        mdAbove={mdAbove}
        dispatch={dispatch}
        statusObj={statusObj}
        userStatus={userStatus}
        selectChat={selectChat}
        createChat={createChat}
        getInitials={getInitials}
        sidebarWidth={sidebarWidth}
        setUserStatus={setUserStatus}
        leftSidebarOpen={leftSidebarOpen}
        removeSelectedChat={removeSelectedChat}
        userProfileLeftOpen={userProfileLeftOpen}
        formatDateToMonthShort={formatDateToMonthShort}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
      <ChatContent
        store={store}
        hidden={hidden}
        sendMsg={handleSendMessage}
        mdAbove={mdAbove}
        dispatch={dispatch}
        statusObj={statusObj}
        getInitials={getInitials}
        sidebarWidth={sidebarWidth}
        userProfileRightOpen={userProfileRightOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
      />
    </Box>
  )
}
AppChat.contentHeightFixed = true

export default AppChat
