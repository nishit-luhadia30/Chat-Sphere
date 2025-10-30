import React, { useState } from 'react';
import { useChatContext } from '../context/ChatContext.jsx';
import SideDrawer from '../components/Chat/SideDrawer.jsx';
import MyChats from '../components/Chat/MyChats.jsx';
import ChatBox from '../components/Chat/ChatBox.jsx';

const ChatPage = () => {
  const { user } = useChatContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full h-screen">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full h-[calc(100vh-4rem)] p-4 gap-4">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
