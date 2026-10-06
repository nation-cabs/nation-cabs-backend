import express from "express";
import {
    getDriverApplications,getPendingDriverApplications,approveDriverApplication,rejectDriverApplication,createDriverAccount
    ,getDriverApplicationForReview,getDriverApplicationDocument
} from "../controllers/hrController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/driver-applications", getDriverApplications);
router.get(
    "/driver-applications/pending",
    authMiddleware,
    authorize("hr"),
    getPendingDriverApplications
);

router.patch(
    "/driver-applications/:id/approve",
     authMiddleware,
    authorize("hr"),
    approveDriverApplication
);
    
router.patch(
    "/driver-applications/:id/reject",
     authMiddleware,
    authorize("hr"),
    rejectDriverApplication
);

router.post(
    "/driver-applications/:id/create-account",
     authMiddleware,
    authorize("hr"),
    createDriverAccount
);

router.get(
    "/driver-applications/:id",
     authMiddleware,
    authorize("hr"),
    getDriverApplicationForReview
);

router.get(
    "/driver-applications/:id/document/:documentType",
    authMiddleware,
    authorize("hr"),
    getDriverApplicationDocument
);
export default router;