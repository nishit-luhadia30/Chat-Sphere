import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { FiDownload, FiPlay, FiPause, FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';

const MessageBubble = ({ message, onReaction, onEdit, onDelete }) => {
    const { user } = useChatContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const audioRef = useRef(null);
    const reactionTimeoutRef = useRef(null);

    const isOwnMessage = message.sender._id === user._id;
    const reactions = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (reactionTimeoutRef.current) {
                clearTimeout(reactionTimeoutRef.current);
            }
        };
    }, []);

    const handleAudioPlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = message.fileUrl;
        link.download = message.fileName;
        link.click();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const canEditOrDelete = () => {
        if (!isOwnMessage) return false;
        const messageAge = Date.now() - new Date(message.createdAt).getTime();
        const timeLimit = 10 * 60 * 1000; // 10 minutes
        return messageAge < timeLimit;
    };

    const renderMessageContent = () => {
        switch (message.messageType) {
            case 'image':
                return (
                    <div className="max-w-xs">
                        <img
                            src={message.fileUrl}
                            alt={message.fileName}
                            className="rounded-lg max-w-full h-auto cursor-pointer"
                            onClick={() => window.open(message.fileUrl, '_blank')}
                        />
                        {message.content && message.content !== message.fileName && (
                            <p className="mt-2 text-sm">{message.content}</p>
                        )}
                    </div>
                );

            case 'audio':
                return (
                    <div className="flex items-center gap-3 min-w-48">
                        <button
                            onClick={handleAudioPlay}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        >
                            {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                        </button>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{message.fileName}</p>
                            <p className="text-xs opacity-75">
                                {formatFileSize(message.fileSize)}
                            </p>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-gray-200 rounded-full"
                        >
                            <FiDownload size={16} />
                        </button>
                        <audio
                            ref={audioRef}
                            src={message.fileUrl}
                            onEnded={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    </div>
                );

            case 'file':
                return (
                    <div className="flex items-center gap-3 min-w-48">
                        <div className="p-2 bg-gray-200 rounded-lg">
                            <FiDownload size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{message.fileName}</p>
                            <p className="text-xs opacity-75">
                                {formatFileSize(message.fileSize)}
                            </p>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                        >
                            Download
                        </button>
                    </div>
                );

            default:
                return (
                    <div>
                        {message.isDeleted ? (
                            <p className="italic opacity-75">This message was deleted</p>
                        ) : (
                            <p>{message.content}</p>
                        )}
                        {message.editedAt && (
                            <p className="text-xs opacity-50 mt-1">(edited)</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="relative group">
            <div
                className={`relative px-4 py-2 rounded-lg max-w-xs break-words ${isOwnMessage
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-200 text-gray-800'
                    }`}
                onMouseEnter={() => {
                    console.log('Mouse entered message bubble');
                    if (reactionTimeoutRef.current) {
                        clearTimeout(reactionTimeoutRef.current);
                    }
                    setShowReactions(true);
                }}
                onMouseLeave={() => {
                    console.log('Mouse left message bubble');
                    // Delay hiding to allow moving to reaction picker
                    reactionTimeoutRef.current = setTimeout(() => {
                        setShowReactions(false);
                    }, 500);
                }}
                onDoubleClick={() => {
                    console.log('Double clicked message - testing reaction');
                    onReaction && onReaction(message._id, '👍');
                }}
            >
                {renderMessageContent()}

                {/* Timestamp */}
                <div
                    className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}
                    style={{ fontSize: '10px', textAlign: 'right' }}
                >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })}
                </div>

                {/* Message Options */}
                {canEditOrDelete() && (
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="absolute -top-2 -right-2 p-1 bg-gray-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <FiMoreHorizontal size={12} />
                    </button>
                )}

                {/* Options Dropdown */}
                {showOptions && (
                    <div className="absolute top-6 right-0 bg-white border rounded-lg shadow-lg z-10">
                        <button
                            onClick={() => {
                                console.log('Edit button clicked', message);
                                onEdit && onEdit(message);
                                setShowOptions(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                        >
                            <FiEdit2 size={14} />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                console.log('Delete button clicked', message._id);
                                onDelete && onDelete(message._id);
                                setShowOptions(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-600 text-sm"
                        >
                            <FiTrash2 size={14} />
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
                <div className="flex gap-1 mt-1">
                    {message.reactions.reduce((acc, reaction) => {
                        const existing = acc.find(r => r.emoji === reaction.emoji);
                        if (existing) {
                            existing.count++;
                            existing.users.push(reaction.user);
                        } else {
                            acc.push({
                                emoji: reaction.emoji,
                                count: 1,
                                users: [reaction.user]
                            });
                        }
                        return acc;
                    }, []).map((reaction, index) => (
                        <span
                            key={index}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                                console.log('Existing reaction clicked', message._id, reaction.emoji);
                                onReaction && onReaction(message._id, reaction.emoji);
                            }}
                            title={reaction.users.map(u => u.name).join(', ')}
                        >
                            {reaction.emoji} {reaction.count}
                        </span>
                    ))}
                </div>
            )}

            {/* Reaction Picker */}
            {showReactions && (
                <div 
                    className="absolute -top-14 left-0 bg-white border rounded-lg shadow-lg p-2 flex gap-1 z-20 reaction-picker"
                    style={{ 
                        transform: isOwnMessage ? 'translateX(-50%)' : 'translateX(0)',
                        left: isOwnMessage ? '50%' : '0'
                    }}
                    onMouseEnter={() => {
                        console.log('Mouse entered reaction picker');
                        if (reactionTimeoutRef.current) {
                            clearTimeout(reactionTimeoutRef.current);
                        }
                        setShowReactions(true);
                    }}
                    onMouseLeave={() => {
                        console.log('Mouse left reaction picker');
                        reactionTimeoutRef.current = setTimeout(() => {
                            setShowReactions(false);
                        }, 200);
                    }}
                >
                    {reactions.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('New reaction clicked', message._id, emoji);
                                onReaction && onReaction(message._id, emoji);
                                setShowReactions(false);
                                if (reactionTimeoutRef.current) {
                                    clearTimeout(reactionTimeoutRef.current);
                                }
                            }}
                            className="reaction-button p-2 hover:bg-gray-100 rounded text-lg transition-colors cursor-pointer"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageBubble;