import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { FiPlus } from 'react-icons/fi';
import api from '../../utils/api';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [showGroupModal, setShowGroupModal] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats, notification, setNotification, unreadMessages, setUnreadMessages } = useChatContext();

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/api/chats');
      setChats(data);
      
      // Initialize unread counts for chats with latest messages
      const initialUnreadCounts = {};
      data.forEach(chat => {
        if (chat.latestMessage && chat.latestMessage.sender._id !== user._id) {
          // For simplicity, we'll assume 1 unread message if the latest message is not from the current user
          // In a real app, you'd track the last seen message timestamp
          initialUnreadCounts[chat._id] = unreadMessages[chat._id] || 1;
        }
      });
      
      setUnreadMessages(prev => ({
        ...prev,
        ...initialUnreadCounts
      }));
    } catch (error) {
      alert('Failed to load chats');
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Clear notifications for this chat
    setNotification(notification.filter(n => n.chat._id !== chat._id));
    // Don't clear unread count immediately - let it clear when messages are actually viewed
  };

  const getChatNotificationCount = (chatId) => {
    return notification.filter(n => n.chat._id === chatId).length;
  };

  const getUnreadCount = (chatId) => {
    return unreadMessages[chatId] || 0;
  };

  const getTotalMessageIndicator = (chat) => {
    const unreadCount = getUnreadCount(chat._id);
    const notificationCount = getChatNotificationCount(chat._id);
    
    // Show different indicators based on status
    if (unreadCount > 0) {
      return { count: unreadCount, type: 'unread', color: 'bg-blue-600' };
    } else if (notificationCount > 0) {
      return { count: '!', type: 'notification', color: 'bg-red-500' };
    } else if (chat.latestMessage && chat.latestMessage.sender._id !== user._id) {
      return { count: '●', type: 'new', color: 'bg-green-500' };
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">My Chats</h3>
          <button
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <FiPlus /> New Group
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {chats ? (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat === chat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {/* Left side - Chat info */}
                    <div className="flex-1 min-w-0">
                      {/* Top row - Name and time */}
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold truncate pr-2">
                          {!chat.isGroupChat
                            ? getSender(loggedUser, chat.users)
                            : chat.chatName}
                        </p>
                        {chat.latestMessage && (
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      
                      {/* Bottom row - Latest message */}
                      {chat.latestMessage && (
                        <p className="text-sm truncate opacity-75 pr-2">
                          {chat.latestMessage.sender._id === user._id ? 'You: ' : ''}
                          {chat.latestMessage.content}
                        </p>
                      )}
                    </div>
                    
                    {/* Right side - Smart notification badges */}
                    <div className="flex flex-col items-center gap-1 ml-2">
                      {(() => {
                        const indicator = getTotalMessageIndicator(chat);
                        if (!indicator) return null;
                        
                        return (
                          <span 
                            className={`${indicator.color} text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium`}
                            title={
                              indicator.type === 'unread' ? `${indicator.count} unread messages` :
                              indicator.type === 'notification' ? 'New notification' :
                              'New message'
                            }
                          >
                            {indicator.count > 99 ? '99+' : indicator.count}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          )}
        </div>
      </div>

      {showGroupModal && (
        <GroupChatModal onClose={() => setShowGroupModal(false)} />
      )}
    </>
  );
};

export default MyChats;
