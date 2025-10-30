import React from 'react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
    >
      <img
        src={user.avatar}
        alt={user.name}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p className="font-semibold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;
