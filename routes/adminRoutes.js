import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getAllBookings , getBookingByCustomerId, updateBookingStatus } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware,authorize("admin"), (req,res) => {
   res.json({
    message: "Welcome Admin"
   })
})

router.get("/bookings", authMiddleware, authorize("admin"), getAllBookings);

router.get("/bookings/:customerId", authMiddleware, authorize("admin"), getBookingByCustomerId);

router.patch("/bookings/:id/status", authMiddleware, authorize("admin"), updateBookingStatus);


export default router;