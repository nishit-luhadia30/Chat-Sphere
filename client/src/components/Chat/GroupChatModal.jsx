import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { FiX } from 'react-icons/fi';
import api from '../../utils/api';
import UserListItem from './UserListItem';

const GroupChatModal = ({ onClose }) => {
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = useChatContext();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const { data } = await api.get(`/api/users?search=${query}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert('Error occurred');
      setLoading(false);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert('User already added');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert('Please fill all fields');
      return;
    }

    try {
      const { data } = await api.post('/api/chats/group', {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });
      setChats([data, ...chats]);
      onClose();
    } catch (error) {
      alert('Failed to create group');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Group Chat</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Group Name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Add Users"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
            >
              {u.name}
              <button onClick={() => handleDelete(u)}>
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
          {loading ? (
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupChatModal;
