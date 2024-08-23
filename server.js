import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoDBSession from 'connect-mongodb-session';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MongoDBStore = MongoDBSession(session);
const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});