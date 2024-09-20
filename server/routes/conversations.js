// routes/chatRoutes.js
import express from 'express';
import { createOrGetConversation, sendMessage, fetchChat, getConversations } from '../controllers/chat.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Route to create or get a conversation between participants
router.post('/conversations', verifyToken, createOrGetConversation);

// Route to send a message within a conversation
router.post('/messages', verifyToken, sendMessage);

// Route to fetch all messages for a specific conversation
router.get('/conversations/:id/messages', verifyToken, fetchChat);

router.get('/conversations', verifyToken, getConversations);

export default router;
