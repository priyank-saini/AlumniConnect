import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from "http";
import { fileURLToPath } from 'url';
import { register } from "./controllers/auth.js";
import { verifyToken } from './middleware/auth.js';
import { createPost } from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import chatRoutes from "./routes/conversations.js";
import "./controllers/passport.js"
import session from 'express-session';
import passport from 'passport';

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true
    }
});


// Socket.IO
io.on('connection', (socket) => {
    console.log("A user connected");

    // Join a conversation room
    socket.on('joinChat', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation: ${conversationId}`);
    });

    // Listen for sending messages
    socket.on('sendMessage', ({ conversationId, senderId, text }) => {
        const message = {
            conversationId,
            senderId: { _id: senderId },
            text,
            createdAt: new Date(),
        };
        io.to(conversationId).emit('receiveMessage', message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});



// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
}));

// File Storage
import { upload } from './utils/multer.js';

// Google Auth
app.use(session({
    secret: process.env.SESSION_SECERT,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes with files
app.post('/auth/register', upload.single("picture"), register);
app.post('/posts', upload.single("picture"), verifyToken, createPost);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use('/chat', chatRoutes);  

// MongoDB setup
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected successfully');
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error(`MongoDB connection error: ${error}`);
    });

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error: ', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
