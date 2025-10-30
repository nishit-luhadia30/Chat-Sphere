import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import { FiX, FiUsers, FiUser, FiClock, FiMessageCircle } from 'react-icons/fi';

const ChatInfoModal = ({ chat, onClose }) => {
    const { user } = useChatContext();

    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString([], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {chat.isGroupChat ? 'Group Info' : 'Chat Info'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Chat Details */}
                <div className="space-y-4">
                    {/* Chat Name/Title */}
                    <div className="text-center">
                        {chat.isGroupChat ? (
                            <>
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiUsers size={32} className="text-white" />
                                </div>
                                <h3 className="text-xl font-semibold">{chat.chatName}</h3>
                                <p className="text-gray-500">{chat.users.length} members</p>
                            </>
                        ) : (
                            <>
                                <img
                                    src={getSender(user, chat.users).avatar}
                                    alt={getSender(user, chat.users).name}
                                    className="w-20 h-20 rounded-full mx-auto mb-3"
                                />
                                <h3 className="text-xl font-semibold">
                                    {getSender(user, chat.users).name}
                                </h3>
                                <p className="text-gray-500">
                                    {getSender(user, chat.users).email}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Chat Statistics */}
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <FiClock className="text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">Created</p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(chat.createdAt)}
                                </p>
                            </div>
                        </div>

                        {chat.latestMessage && (
                            <div className="flex items-center gap-3 mb-3">
                                <FiMessageCircle className="text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium">Last Message</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(chat.latestMessage.createdAt)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Members List (for group chats) */}
                    {chat.isGroupChat && (
                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <FiUsers size={16} />
                                Members ({chat.users.length})
                            </h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {chat.users.map((member) => (
                                    <div key={member._id} className="flex items-center gap-3">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {member.name}
                                                {member._id === user._id && (
                                                    <span className="text-xs text-blue-600 ml-1">(You)</span>
                                                )}
                                                {member._id === chat.groupAdmin?._id && (
                                                    <span className="text-xs text-green-600 ml-1">(Admin)</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* User Status (for direct chats) */}
                    {!chat.isGroupChat && (
                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">About</h4>
                            <p className="text-sm text-gray-600">
                                {getSender(user, chat.users).status || 'Hey there! I am using ChatSphere'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <div className="mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInfoModal;