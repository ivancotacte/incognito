import express from 'express';
import { sendMessage, upload } from '../controllers/messageController.js';
const router = express.Router();

router.get('/:username', upload.single('image'), sendMessage);

export default router;