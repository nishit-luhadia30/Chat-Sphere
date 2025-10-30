import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../../context/ChatContext.jsx';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import UserListItem from './UserListItem';
import api from '../../utils/api';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const { user, setUser, setSelectedChat, chats, setChats, notification, setNotification, unreadMessages, setUnreadMessages } = useChatContext();
  const navigate = useNavigate();

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setSelectedChat(null);
    setChats([]);
    setNotification([]);
    setUnreadMessages({});
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      alert('Please enter something in search');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/api/users?search=${search}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert('Error occurred');
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await api.post('/api/chats', { userId });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setShowSearch(false);
    } catch (error) {
      alert('Error fetching the chat');
      setLoadingChat(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white px-4 py-3 shadow-md">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FiSearch />
          <span className="hidden md:inline">Search User</span>
        </button>

        <h2 className="text-2xl font-bold text-gray-800">ChatSphere</h2>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiBell size={20} />
              {notification.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notification.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {notification.length > 0 && (
                      <button
                        onClick={() => setNotification([])}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notification.length > 0 ? (
                    notification.map((notif, index) => (
                      <div
                        key={notif._id || index}
                        onClick={() => {
                          setSelectedChat(notif.chat);
                          setNotification(notification.filter((_, i) => i !== index));
                          setShowNotifications(false);
                        }}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={notif.sender?.avatar || '/default-avatar.png'}
                            alt={notif.sender?.name || 'Unknown'}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{notif.sender?.name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-600 truncate">{notif.content}</p>
                            <p className="text-xs text-gray-400">
                              {notif.chat?.isGroupChat ? notif.chat.chatName : 'Direct Message'}
                            </p>
                            <p className="text-xs text-gray-300">
                              {new Date(notif.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <FiChevronDown />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="absolute top-16 left-0 w-full md:w-96 bg-white shadow-lg p-4 z-50">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="space-y-2">
              {searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))}
            </div>
          )}
          {loadingChat && <div className="text-center py-2">Loading chat...</div>}
        </div>
      )}
    </>
  );
};

export default SideDrawer;
