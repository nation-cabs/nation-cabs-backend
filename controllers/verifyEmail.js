import User from "../model/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyEmail = async (req, res) => {

    try {

        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Token missing."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        await User.verifyEmail(decoded.email);

        return res.status(200).json({
            message: "Email verified successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            message: "Invalid or expired token."
        });

    }

};