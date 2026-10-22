import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { createBooking, getBookings } from "../controllers/bookingController.js";

const router = express.Router()

router.post("/",authMiddleware, authorize("customer"), createBooking)
router.get( "/", authMiddleware, authorize("customer"), getBookings );

export default router;