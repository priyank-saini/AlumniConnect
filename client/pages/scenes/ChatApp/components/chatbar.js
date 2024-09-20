import axios from 'axios';
import { InputBase, Button, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Chatbar({ userId, conversationId, receipientName, receipientProfile, socket }) {
  const token = useSelector((state) => state.token);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Join the chat room on conversationId change
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit('joinChat', conversationId);  // Emit joinChat when conversationId changes
    }
  }, [conversationId, socket]);

  // Fetch messages for the conversation
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/chat/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
        console.log("Messages received: ", response.data)
      } catch (error) {
        console.log('Error in fetchMessages: ', error);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId, token]);

  // Listen for incoming messages via WebSocket
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        // Ensure sender is an object with _id property
        const formattedMessage = {
          ...message,
          sender: { _id: message.sender },
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);


  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      // Emit the message via WebSocket
      socket.emit('sendMessage', { conversationId, senderId: userId, text: message });

      // Optionally save message to the server
      const response = await axios.post(
        'http://localhost:3001/chat/messages',
        { conversationId, senderId: userId, text: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // // Append the new message to the chat
      console.log(response.data);
      setMessages([...messages, response.data]);
      setMessage('');
    } catch (error) {
      console.log('Error in handleSendMessage: ', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f1f1f1] px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="font-bold text-gray-600 text-[24px]">Chat with {receipientName}</p>
      </div>

      <div className="flex-grow overflow-y-auto my-4">
        {messages.map((msg) => (
          <div key={msg._id} className={`flex flex-row gap-2 ${msg.sender && (msg.sender._id || msg.sender) === userId ? 'justify-end' : 'justify-start'} items-end`}>
            {msg.sender && (msg.sender._id || msg.sender) !== userId && (
              <img src={receipientProfile} className='w-[40px] h-[40px] object-cover rounded-full' alt="Profile Picture" />
            )}
            <div className={`flex flex-col ${msg.sender && (msg.sender._id || msg.sender) === userId ? 'items-end' : 'items-start'}`}>
              <div className={`${msg.sender && (msg.sender._id || msg.sender) === userId ? 'bg-[#FBF9F1]' : 'bg-[#77E4C8]'} px-[15px] py-[5px] rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-none flex items-center`}>
                <p className="font-normal text-[16px] max-w-[300px]">{msg.text}</p>
              </div>
              <p className="text-[12px] text-[#9B9B9B]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="w-full" onSubmit={handleSendMessage}>
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', paddingX: '20px', paddingY: '10px', borderRadius: '10px' }}>
          <InputBase placeholder={`Message ${receipientName}`} sx={{ flex: 1 }} fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button type="submit" sx={{ backgroundColor: 'black', color: 'white', marginLeft: '10px', borderRadius: '8px', padding: '8px 16px' }}>
            Send
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default Chatbar;
