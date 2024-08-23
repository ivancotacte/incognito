import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoDBSession from 'connect-mongodb-session';
import { connectMongoDB } from './src/db/mongoConnection.js';
import authRoutes from './src/routes/authRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
dotenv.config();
connectMongoDB();

const app = express();
const PORT = process.env.PORT || 3000;

const MongoDBStore = MongoDBSession(session);
const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    databaseName : process.env.MONGO_DB_NAME,
    collection: 'sessions'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use('/api/auth', authRoutes);
app.use('/', messageRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});