import User from "../models/user.models.js";
import bcrypt from "bcryptjs"
import { generateTokens } from "../utils/utils.js";
import Post from "../models/post.model.js";


// handle signup ---
export const signup = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({
            message: "User successfully created.",
            id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            fullName: newUser.fullName,
        });

    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


// handle login ---
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isCorrectPass = await bcrypt.compare(password, user.password);
        if (!isCorrectPass) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        // Generate Access & Refresh Tokens
        const { accessToken } = generateTokens(user._id, res);

        // Respond with user info and access token
        res.status(200).json({
            message: "User successfully logged in.",
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            accessToken, // Return access token
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};



// handle logout ---
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out Successfuly." })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ message: "Internal Server Error." })
    }
};



export const updateProfile = async (req, res) => {
    try {
        const img = req.file.filename
        const userId = req.user._id

        // await Post.findByIdAndUpdate(
        //     userId,
        //     { senderImage: img },
        //     { new: true }
        // )

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: img },
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};



// handle checking auth ---
export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


export const getPersonalInfo = async (req, res) => {
    try {
        const myId = req.user._id;

        const myInfo = await User.findById(myId).select("-password");
        if (!myInfo) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(myInfo);
    } catch (error) {
        console.error("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


