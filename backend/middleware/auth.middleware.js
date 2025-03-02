import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "UNAUTHORIZED! No token provided." });
        }

        console.log(authHeader)
        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedJwt) {
            return res.status(401).json({ message: "UNAUTHORIZED! Invalid token." });
        }

        // Find user (excluding password)
        const user = await User.findById(decodedJwt.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "NO USER FOUND!" });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
