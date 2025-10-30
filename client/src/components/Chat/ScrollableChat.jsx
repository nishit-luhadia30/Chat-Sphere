import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';
import UserProfileModal from './UserProfileModal';

const ScrollableChat = ({ messages, onReaction, onEdit, onDelete }) => {
  const { user, selectedChat } = useChatContext();
  const [showUserProfile, setShowUserProfile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return 'auto';
  };

  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const shouldShowSenderName = (messages, m, i) => {
    return (
      selectedChat?.isGroupChat &&
      m.sender._id !== user._id &&
      (i === 0 || messages[i - 1].sender._id !== m.sender._id)
    );
  };

  const shouldShowDateSeparator = (messages, m, i) => {
    if (i === 0) return true;

    const currentDate = new Date(m.createdAt).toDateString();
    const previousDate = new Date(messages[i - 1].createdAt).toDateString();

    return currentDate !== previousDate;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      {messages &&
        messages.map((m, i) => (
          <div key={m._id}>
            {/* Date separator */}
            {shouldShowDateSeparator(messages, m, i) && (
              <div className="flex justify-center my-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                  {formatDate(m.createdAt)}
                </span>
              </div>
            )}

            <div className="flex items-end mb-1">
              {/* Avatar - show for others' messages */}
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <img
                  src={m.sender.avatar}
                  alt={m.sender.name}
                  className="w-8 h-8 rounded-full mr-2 mb-1 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                  onClick={() => setShowUserProfile(m.sender)}
                />
              )}

              <div
                className={`flex flex-col ${
                  m.sender._id === user._id ? 'items-end ml-auto' : 'items-start'
                }`}
                style={{
                  marginLeft:
                    m.sender._id !== user._id
                      ? isSameSenderMargin(messages, m, i, user._id)
                      : 'auto',
                  marginTop: isSameUser(messages, m, i) ? 2 : 8,
                }}
              >
                {/* Sender name for group chats */}
                {shouldShowSenderName(messages, m, i) && (
                  <span className="text-xs text-gray-500 mb-1 ml-1">
                    {m.sender.name}
                  </span>
                )}

                {/* Message bubble */}
                <MessageBubble
                  message={m}
                  onReaction={onReaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>
          </div>
        ))}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
      
      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfileModal
          user={showUserProfile}
          onClose={() => setShowUserProfile(null)}
        />
      )}
    </div>
  );
};

export default ScrollableChat;
