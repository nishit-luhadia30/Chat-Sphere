import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatContext();

  return (
    <div
      className={`${
        selectedChat ? 'flex' : 'hidden md:flex'
      } flex-col flex-1 bg-white rounded-lg shadow-md`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
