import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/user-dashboard", authMiddleware,authorize("customer"), (req,res) => {
   res.json({
    message: "Welcome Customer"
   })

})
export default router;