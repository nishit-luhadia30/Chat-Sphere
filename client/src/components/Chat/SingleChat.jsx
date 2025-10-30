import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { FiArrowLeft, FiEye, FiPaperclip, FiSend } from 'react-icons/fi';
import api from '../../utils/api';
import ScrollableChat from './ScrollableChat';
import ChatInfoModal from './ChatInfoModal';
import FileUpload from './FileUpload';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  const { user, selectedChat, setSelectedChat, notification, setNotification, unreadMessages, setUnreadMessages } = useChatContext();

  const getUnreadCount = (chatId) => {
    return unreadMessages[chatId] || 0;
  };

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit('setup', user);
      socket.on('connected', () => setSocketConnected(true));
      socket.on('typing', () => setIsTyping(true));
      socket.on('stop_typing', () => setIsTyping(false));
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await api.get(`/api/messages/${selectedChat._id}`);
      setMessages(data);
      setLoading(false);
      socket.emit('join_chat', selectedChat._id);
      
      // Mark messages as read only after they're loaded and displayed
      setUnreadMessages(prev => ({
        ...prev,
        [selectedChat._id]: 0
      }));
    } catch (error) {
      alert('Error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

    // Mark messages as read when chat is opened
    if (selectedChat) {
      setUnreadMessages(prev => ({
        ...prev,
        [selectedChat._id]: 0
      }));
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      console.log('Message received:', newMessageReceived);
      console.log('Selected chat compare:', selectedChatCompare);

      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        console.log('Adding to notifications - different chat');
        // Add to notifications if not in the same chat
        setNotification(prev => {
          // Check if notification already exists
          const exists = prev.some(notif => notif._id === newMessageReceived._id);
          if (!exists) {
            console.log('New notification added');
            return [newMessageReceived, ...prev];
          }
          console.log('Notification already exists');
          return prev;
        });

        // Increment unread count for this chat
        setUnreadMessages(prev => ({
          ...prev,
          [newMessageReceived.chat._id]: (prev[newMessageReceived.chat._id] || 0) + 1
        }));

        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${newMessageReceived.sender.name}`, {
            body: newMessageReceived.content,
            icon: newMessageReceived.sender.avatar,
          });
        }
      } else {
        console.log('Adding to current chat messages');
        setMessages(prev => [...prev, newMessageReceived]);
      }
    };

    if (socket) {
      socket.on('message_received', handleMessageReceived);
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.off('message_received', handleMessageReceived);
      }
    };
  }, [selectedChatCompare, setNotification, setUnreadMessages]);

  const sendMessage = async (e) => {
    if (e && e.key === 'Enter' && newMessage.trim()) {
      await handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    socket.emit('stop_typing', selectedChat._id);
    
    try {
      const messageContent = newMessage;
      setNewMessage('');

      if (editingMessage) {
        // Edit existing message
        const { data } = await api.put('/api/messages/edit', {
          messageId: editingMessage._id,
          content: messageContent,
        });
        
        setMessages(prev => prev.map(msg => 
          msg._id === editingMessage._id ? data : msg
        ));
        setEditingMessage(null);
        socket.emit('message_edited', data);
      } else {
        // Send new message
        const { data } = await api.post('/api/messages', {
          content: messageContent,
          chatId: selectedChat._id,
        });

        socket.emit('new_message', data);
        setMessages(prev => [...prev, data]);
      }
    } catch (error) {
      alert('Error occurred');
      console.error('Send message error:', error);
    }
  };

  const handleFileUploaded = (fileMessage) => {
    socket.emit('new_message', fileMessage);
    setMessages(prev => [...prev, fileMessage]);
  };

  const handleReaction = async (messageId, emoji) => {
    console.log('Handling reaction:', messageId, emoji);
    try {
      const { data } = await api.post('/api/messages/reaction', {
        messageId,
        emoji,
      });
      
      console.log('Reaction response:', data);
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? data : msg
      ));
      
      socket.emit('message_reaction', data);
    } catch (error) {
      console.error('Reaction error:', error);
      alert('Failed to add reaction: ' + error.response?.data?.message);
    }
  };

  const handleEditMessage = (message) => {
    console.log('Editing message:', message);
    setEditingMessage(message);
    setNewMessage(message.content);
  };

  const handleDeleteMessage = async (messageId) => {
    console.log('Deleting message:', messageId);
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const { data } = await api.delete(`/api/messages/delete/${messageId}`);
      
      console.log('Delete response:', data);
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? data : msg
      ));
      
      socket.emit('message_deleted', data);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete message: ' + error.response?.data?.message);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop_typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex justify-between items-center p-4 border-b">
            <button
              onClick={() => setSelectedChat('')}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft />
            </button>
            <h3 className="text-xl font-semibold">
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName}
            </h3>
            <div className="flex items-center gap-2">
              {/* Mark as Read Button */}
              {getUnreadCount(selectedChat._id) > 0 && (
                <button
                  onClick={() => {
                    setUnreadMessages(prev => ({
                      ...prev,
                      [selectedChat._id]: 0
                    }));
                  }}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  title="Mark as Read"
                >
                  Mark Read ({getUnreadCount(selectedChat._id)})
                </button>
              )}
              
              <button
                onClick={() => setShowChatInfo(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Chat Info"
              >
                <FiEye />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Messages area with fixed height and scroll */}
            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {loading ? (
                <div className="text-center">Loading messages...</div>
              ) : (
                <ScrollableChat 
                  messages={messages} 
                  onReaction={handleReaction}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />
              )}
            </div>

            {/* Typing indicator and input area - fixed at bottom */}
            <div className="p-4 bg-white border-t">
              {isTyping && (
                <div className="text-sm text-gray-500 italic mb-2">Typing...</div>
              )}
              
              {editingMessage && (
                <div className="mb-2 p-2 bg-yellow-100 rounded-lg text-sm">
                  <span className="font-medium">Editing message</span>
                  <button
                    onClick={() => {
                      setEditingMessage(null);
                      setNewMessage('');
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FiPaperclip size={20} />
                </button>
                
                <input
                  type="text"
                  placeholder={editingMessage ? "Edit message..." : "Type a message..."}
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>

            {/* File Upload Component */}
            {showFileUpload && (
              <FileUpload
                chatId={selectedChat._id}
                onFileUploaded={handleFileUploaded}
                onClose={() => setShowFileUpload(false)}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-xl">
          Click on a user to start chatting
        </div>
      )}

      {/* Chat Info Modal */}
      {showChatInfo && (
        <ChatInfoModal
          chat={selectedChat}
          onClose={() => setShowChatInfo(false)}
        />
      )}
    </>
  );
};

export default SingleChat;
