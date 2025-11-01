import React, { useState } from 'react';
import { useChatContext } from '../context/ChatContext.jsx';
import SideDrawer from '../components/Chat/SideDrawer.jsx';
import MyChats from '../components/Chat/MyChats.jsx';
import ChatBox from '../components/Chat/ChatBox.jsx';

const ChatPage = () => {
  const { user, selectedChat } = useChatContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full h-screen">
      {user && <SideDrawer />}
      <div className="flex w-full h-[calc(100vh-4rem)] p-4 gap-4 overflow-hidden">
        {user && (
          <div className={`${
            selectedChat ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 flex-shrink-0`}>
            <MyChats fetchAgain={fetchAgain} />
          </div>
        )}
        {user && (
          <div className={`${
            selectedChat ? 'flex' : 'hidden md:flex'
          } flex-1 min-w-0`}>
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
