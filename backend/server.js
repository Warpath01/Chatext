import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/messages.route.js";
import postsRoutes from "./routes/posts.route.js";

import path from 'path';
import { fileURLToPath } from 'url';
import { app, server } from "./config/socket.js";

// "https://chatext-client.onrender.com"


dotenv.config();
// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://chatext-client.onrender.com",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/posts", postsRoutes);

app.get("/", (req, res) => {
    res.send("This Server is Ready!");
});

// Static Files Serving (Only in Production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });

    app.use('/profile-pics', express.static(path.join(__dirname, 'uploaded', 'profilepics')));
    app.use('/post-pics', express.static(path.join(__dirname, 'uploaded', 'posts')));
}

// Start Server
const PORT = process.env.PORT || 7000;

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
};

startServer();

export default app;




