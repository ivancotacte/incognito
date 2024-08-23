import { writeData, readData } from '../db/mongoConnection.js';
import jwt from 'jsonwebtoken';

async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        const users = await readData('users');
        const userExists = users.some(user => user.email === email);
        const usernameExists = users.some(user => user.username === username);

        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await writeData('users', { username, email, password });
    
        res.status(200).json({
            message: 'User registered successfully',
            data: {
                username,
                email
            },
        });
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const users = await readData('users');
        const user = users.find(user => user.email === email && user.password === password);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const token = generateToken(user);
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
}

function generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
}

export { register, login };