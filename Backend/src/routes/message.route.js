import express from 'express';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { getMessages, getUsersforSidebar, sendMessage } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/user', checkAuth, getUsersforSidebar)
router.get('/:id', checkAuth, getMessages);

router.post('/send/:id', checkAuth, sendMessage)

export default router;