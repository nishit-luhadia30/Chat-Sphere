const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messageType: { 
      type: String, 
      enum: ['text', 'image', 'audio', 'file'], 
      default: 'text' 
    },
    fileUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    reactions: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
