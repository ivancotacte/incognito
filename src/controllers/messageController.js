import { writeData, readData } from '../db/mongoConnection.js';

async function sendMessage(req, res) {
    const { username } = req.params;
    const { message } = req.body;
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

        await writeData('messages', { username, message, timestamp: new Date() });

        res.status(200).json({ username: username, message: message });
    } catch (error) {
        console.error('Error sending message', error);
        res.status(500).json({ message: 'Error sending message', error });
    }
}

export { sendMessage };