import express from 'express';
import { sendMessage } from '../controllers/messageController.js';
const router = express.Router();

router.get('/:username', sendMessage);

export default router;