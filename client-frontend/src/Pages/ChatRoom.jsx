import React, { useRef, useState } from "react";
import ChatBox from "../Components/ChatBox.jsx";
import Conversation from "../Components/Conversation.jsx";
import "../Css/ChatRoom.css"
import { useEffect } from "react";
import { userChats } from "../Api/chat.js";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {logout} from '../Actions/authActions.js'
const ChatRoom = () => {
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);

  
  const dispatch = useDispatch()
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  
  const handleLogOut = ()=> {
    dispatch(logout())
  }

  useEffect(() => {
    if (receivedMessage) {
      const chatId = receivedMessage.chatId;
      const isCurrentChat = currentChat && currentChat._id === chatId;
      if (!isCurrentChat) {
        setUnreadMessages((prevUnreadMessages) => {
          return { ...prevUnreadMessages, [chatId]: prevUnreadMessages[chatId] + 1 || 1 };
        });
      }
    }
  }, [receivedMessage, currentChat]);

  useEffect(() => {
    if (sendMessage) {
      const chatId = sendMessage.chatId;
      setUnreadMessages((prevUnreadMessages) => {
        return { ...prevUnreadMessages, [chatId]: prevUnreadMessages[chatId] + 1 || 1 };
      });
    }
  }, [sendMessage]);


  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data)
      setReceivedMessage(data);
    }

    );
  }, []);


  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return ( 
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                onClick={() => {
                  setCurrentChat(chat);
                  setUnreadMessages((prevUnreadMessages) => {
                    return { ...prevUnreadMessages, [chat._id]: 0 };
                  });
                }}
              >
              
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
                 {unreadMessages[chat._id] > 0 && (
      <div className="unread-message-count">{unreadMessages[chat._id]}</div>
    )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="Right-side-chat">
      <button className="button logout-button" onClick={handleLogOut}>Log Out</button>
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
        
      </div>
    </div>
  );
};

export default ChatRoom;