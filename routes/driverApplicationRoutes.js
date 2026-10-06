import express from "express";
import multer from "multer";
import { createApplication } from "../controllers/driverApplicationController.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB per file
    },

    fileFilter: (req, file, cb) => {

        const pdfFields = [
            "idDocument",
            "licenseDocument",
            "pdpDocument",
            "proofOfAddress",
            "cv"
        ];

        const imageFields = [
            "profilePhoto"
        ];


        // ========================================
        // PDF DOCUMENTS
        // ========================================

        if (pdfFields.includes(file.fieldname)) {

            const isPdfMime =
                file.mimetype === "application/pdf";

            const isPdfExtension =
                file.originalname
                    .toLowerCase()
                    .endsWith(".pdf");

            if (isPdfMime && isPdfExtension) {
                return cb(null, true);
            }

            return cb(
                new Error(
                    `${file.fieldname} must be a PDF file.`
                )
            );
        }


        // ========================================
        // PROFILE PHOTO
        // ========================================

        if (imageFields.includes(file.fieldname)) {

            const allowedImages = [
                "image/jpeg",
                "image/png"
            ];

            const allowedExtensions = [
                ".jpg",
                ".jpeg",
                ".png"
            ];

            const extension = file.originalname
                .toLowerCase()
                .slice(
                    file.originalname.lastIndexOf(".")
                );

            const validMime =
                allowedImages.includes(file.mimetype);

            const validExtension =
                allowedExtensions.includes(extension);

            if (validMime && validExtension) {
                return cb(null, true);
            }

            return cb(
                new Error(
                    "Profile photo must be JPG, JPEG, or PNG."
                )
            );
        }


        // ========================================
        // UNKNOWN FILE FIELD
        // ========================================

        return cb(
            new Error(
                `Unexpected file field: ${file.fieldname}`
            )
        );
    }
});


router.post(
    "/",

    upload.fields([
        {
            name: "idDocument",
            maxCount: 1
        },
        {
            name: "licenseDocument",
            maxCount: 1
        },
        {
            name: "pdpDocument",
            maxCount: 1
        },
        {
            name: "proofOfAddress",
            maxCount: 1
        },
        {
            name: "profilePhoto",
            maxCount: 1
        },
         { name: "cv",
            maxCount: 1 }
    ]),

    createApplication
);


export default router;