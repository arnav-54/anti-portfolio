const express = require('express');
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', sendMessage);
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
