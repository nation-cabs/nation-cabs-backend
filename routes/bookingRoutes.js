import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { createBooking, getBookings, cancelCustomerBooking  } from "../controllers/bookingController.js";

const router = express.Router()

router.post("/",authMiddleware, authorize("customer"), createBooking)
router.get( "/", authMiddleware, authorize("customer"), getBookings );
router.patch("/:id/cancel", authMiddleware, authorize("customer"),cancelCustomerBooking);

export default router;