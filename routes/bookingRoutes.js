import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router()

router.post("/",authMiddleware, authorize("customer"), createBooking)

export default router;