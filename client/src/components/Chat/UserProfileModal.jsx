import React from 'react';
import { FiX, FiMail, FiClock, FiUsers } from 'react-icons/fi';

const UserProfileModal = ({ user, onClose, mutualGroups = [] }) => {
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-100"
          />
          <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
          <p className="text-gray-600 mb-4">{user.status || 'Hey there! I am using ChatSphere'}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <FiMail className="text-gray-500" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiClock className="text-gray-500" />
            <div>
              <p className="text-sm font-medium">Last Seen</p>
              <p className="text-sm text-gray-600">{formatLastSeen(user.lastSeen)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiUsers className="text-gray-500" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Mutual Groups */}
        {mutualGroups.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FiUsers size={16} />
              Mutual Groups ({mutualGroups.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {mutualGroups.map((group) => (
                <div key={group._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FiUsers size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{group.chatName}</p>
                    <p className="text-xs text-gray-500">{group.users.length} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-4 border-t flex gap-2">
          <button
            onClick={() => {
              // TODO: Start chat with this user
              onClose();
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          >
            Send Message
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;