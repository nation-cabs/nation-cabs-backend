import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware,authorize("admin"), (req,res) => {
   res.json({
    message: "Welcome Admin"
   })
})
export default router;