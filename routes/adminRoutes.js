import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getAllBookings , getBookingByCustomerId, updateBookingStatus, getApprovedDrivers, assignDriverToBooking } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware,authorize("admin"), (req,res) => {
   res.json({
    message: "Welcome Admin"
   })
})

//====Booking routes=======//
router.get("/bookings", authMiddleware, authorize("admin"), getAllBookings);

router.get("/bookings/:customerId", authMiddleware, authorize("admin"), getBookingByCustomerId);

router.patch("/bookings/:id/status", authMiddleware, authorize("admin"), updateBookingStatus);

//====Driver routes=======//

router.get("/drivers/approved", authMiddleware, authorize("admin"), getApprovedDrivers);

router.patch("/bookings/:id/assign-driver", authMiddleware, authorize("admin"), assignDriverToBooking);

export default router;