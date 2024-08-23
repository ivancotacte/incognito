import { writeData, readData } from '../db/mongoConnection.js';
import multer from 'multer';
import moment from 'moment-timezone';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${moment().tz('Asia/Manila').format('YYYY-MM-DD HH-mm-ss')}-${file.originalname}`);
    }
});

const upload = multer({ storage });

async function sendMessage(req, res) {
    const { username } = req.params;
    const { message } = req.body;
    const file = req.file; 

    try {
        const users = await readData('users');

        if (users.length === 0) {
            return res.status(400).json({ message: 'No users found in the database' });
        }

        const userExists = users.some(user => user.username === username);

        if (!userExists) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        
        const messageData = {
            username,
            message: message || null,
            timestamp: moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss'),
            imageUrl: file ? file.path : null
        };

        await writeData('messages', messageData);

        res.status(200).json({ code: 200, message: "", messageInfo: { username, message, timestamp: messageData.timestamp, imageUrl: messageData.imageUrl } });
    } catch (error) {
        console.error('Error sending message', error);
        res.status(500).json({ message: 'Error sending message', error });
    }
}

export { sendMessage, upload };