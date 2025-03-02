import jwt from "jsonwebtoken";

export const generateTokens = (userId, res) => {
    // Generate Access Token (short-lived)
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d", // 15 minutes
    });

    // Generate Refresh Token (longer-lived)
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d", // 7 days
    });

    // Store Refresh Token in HTTP-only Cookie
    res.cookie("jwt", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", // Secure in production
    });

    return { accessToken, refreshToken };
};
