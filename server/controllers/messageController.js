const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar email')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, messageType = 'text' } = req.body;

  if (!content || !chatId) {
    res.status(400);
    throw new Error('Invalid data passed into request');
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    messageType: messageType,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name avatar');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name avatar email',
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Add reaction to message
const addReaction = asyncHandler(async (req, res) => {
  const { messageId, emoji } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if it exists
      message.reactions = message.reactions.filter(
        r => !(r.user.toString() === req.user._id.toString() && r.emoji === emoji)
      );
    } else {
      // Add new reaction
      message.reactions.push({
        user: req.user._id,
        emoji: emoji
      });
    }

    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'name avatar')
      .populate('reactions.user', 'name avatar');

    res.json(updatedMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Edit message
const editMessage = asyncHandler(async (req, res) => {
  const { messageId, content } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    // Check if message is within edit time limit (10 minutes)
    const editTimeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds
    const messageAge = Date.now() - new Date(message.createdAt).getTime();

    if (messageAge > editTimeLimit) {
      return res.status(400).json({ message: 'Message edit time limit exceeded' });
    }

    message.content = content;
    message.editedAt = new Date();
    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'name avatar')
      .populate('reactions.user', 'name avatar');

    res.json(updatedMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Delete message
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    // Check if message is within delete time limit (10 minutes)
    const deleteTimeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds
    const messageAge = Date.now() - new Date(message.createdAt).getTime();

    if (messageAge > deleteTimeLimit) {
      return res.status(400).json({ message: 'Message delete time limit exceeded' });
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'name avatar')
      .populate('reactions.user', 'name avatar');

    res.json(updatedMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage, addReaction, editMessage, deleteMessage };
