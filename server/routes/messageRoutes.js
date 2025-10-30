const express = require('express');
const {
  allMessages,
  sendMessage,
  addReaction,
  editMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:chatId').get(protect, allMessages);
router.route('/').post(protect, sendMessage);
router.route('/reaction').post(protect, addReaction);
router.route('/edit').put(protect, editMessage);
router.route('/delete/:messageId').delete(protect, deleteMessage);

module.exports = router;
