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
// OR allow all origins (for development purposes)
app.use(
    cors({
        origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://chatext-client.onrender.com",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"], // Allow Authorization header
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed HTTP methods
    })
);

app.options("*", cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://chatext-client.onrender.com"); // Allow frontend domain
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("This Server is Ready!");
});

const PORT = process.env.PORT || 7000;


// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __otherDirname = path.resolve()

// allow static use -- 
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    })

    app.use('/profile-pics', express.static(path.join(__dirname, 'uploaded', 'profilepics')));
    app.use('/post-pics', express.static(path.join(__dirname, 'uploaded', 'posts')));
}

const startServer = async () => {
    await connectDB();

    // Use routes endpoints-----
    app.use("/api/auth", authRoutes)
    app.use("/api/messages", messagesRoutes)
    app.use("/api/posts", postsRoutes)

    server.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
};
startServer();

export default app;




