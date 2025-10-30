const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

const router = express.Router();

// Upload file and create message
router.post('/upload', protect, upload.single('file'), asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { chatId, messageType } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'chatsphere',
          public_id: `${Date.now()}_${req.file.originalname}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Determine message type based on file
    let detectedType = messageType;
    if (!detectedType) {
      const mimeType = req.file.mimetype;
      if (mimeType.startsWith('image/')) detectedType = 'image';
      else if (mimeType.startsWith('audio/')) detectedType = 'audio';
      else detectedType = 'file';
    }

    // Create message with file
    const newMessage = await Message.create({
      sender: req.user._id,
      content: req.file.originalname,
      chat: chatId,
      messageType: detectedType,
      fileUrl: uploadResult.secure_url,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    // Populate message
    let message = await Message.findById(newMessage._id)
      .populate('sender', 'name avatar')
      .populate('chat');

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
}));

module.exports = router;