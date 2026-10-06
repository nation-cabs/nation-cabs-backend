import express from 'express'
import {signup, login} from '../controllers/authController.js';
import authMiddleware from "../middleware/authMiddleware.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { verifyEmail } from '../controllers/verifyEmail.js';


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.get("/test-email", async (req, res) => {
    try {
        await sendVerificationEmail(
            "nqobilehlongwane708@gmail.com",
            "test-token-123"
        );

        res.json({
            message: "Test email sent successfully"
        });

    } catch (error) {

        console.error(
            "TEST EMAIL ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to send test email",
            error: error.message
        });
    }
});
router.get("/verify-email", verifyEmail);
    



export default router;
