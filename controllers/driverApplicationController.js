import DriverApplication from "../model/DriverApplication.js";
import { validateDriverApplication } from "../utils/validateDriverApplication.js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";


// ============================================
// SAVE UPLOADED FILE LOCALLY
// ============================================

const uploadFile = async (file, folder) => {

    if (!file) {
        return null;
    }

    // Get file extension
    const fileExtension = path
        .extname(file.originalname)
        .toLowerCase();

    // Generate unique filename
    const fileName = `${crypto.randomUUID()}${fileExtension}`;

    // Upload directory
    const uploadDirectory = path.join(
        process.cwd(),
        "uploads",
        "driver-documents",
        folder
    );

    // Create directory if it doesn't exist
    await fs.mkdir(uploadDirectory, {
        recursive: true
    });

    // Full file path
    const filePath = path.join(
        uploadDirectory,
        fileName
    );

    // Save file
    await fs.writeFile(
        filePath,
        file.buffer
    );

    // Return path that will be stored in database
    return path
        .join(
            "driver-documents",
            folder,
            fileName
        )
        .replaceAll("\\", "/");
};


// ============================================
// CREATE DRIVER APPLICATION
// ============================================

export const createApplication = async (req, res) => {

    try {

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);


        // ========================================
        // VALIDATE FORM
        // ========================================

        const error = validateDriverApplication(req.body);

        if (error) {
            return res.status(400).json({
                message: error
            });
        }


        // ========================================
        // SAVE DOCUMENTS
        // ========================================

        const idDocument = await uploadFile(
            req.files?.idDocument?.[0],
            "id-documents"
        );

        const licenseDocument = await uploadFile(
            req.files?.licenseDocument?.[0],
            "license-documents"
        );

        const pdpDocument = await uploadFile(
            req.files?.pdpDocument?.[0],
            "pdp-documents"
        );

        const proofOfAddress = await uploadFile(
            req.files?.proofOfAddress?.[0],
            "proof-of-address"
        );

        const profilePhoto = await uploadFile(
            req.files?.profilePhoto?.[0],
            "profile-photos"
        );

        const cvDocument = await uploadFile(
    req.files?.cv?.[0],
    "cvs"
);
        // ========================================
        // CREATE DATABASE RECORD
        // ========================================

        const application = await DriverApplication.createApplication({

            first_name: req.body.firstName,

            last_name: req.body.lastName,

            email: req.body.email,

            phone: req.body.phone,

            date_of_birth: req.body.dateOfBirth,

            gender: req.body.gender,

            province: req.body.province,

            city: req.body.city,

            address: req.body.address,

            license_number: req.body.licenseNumber,

            license_expiry: req.body.licenseExpiry,

            pdp_number: req.body.pdpNumber,

            pdp_expiry: req.body.pdpExpiry,

            driving_experience: req.body.drivingExperience,

            emergency_name: req.body.emergencyName,

            emergency_relationship:
                req.body.emergencyRelationship,

            emergency_phone:
                req.body.emergencyPhone,


            // Uploaded documents
            id_document: idDocument,

            license_document: licenseDocument,

            pdp_document: pdpDocument,

            proof_of_address: proofOfAddress,

            profile_photo: profilePhoto,
            
            cv_document: cvDocument,

            // Consent fields
            agree_information:
                req.body.agreeInformation === "true",

            agree_background:
                req.body.agreeBackground === "true",

            agree_terms:
                req.body.agreeTerms === "true",


            // Application status
            application_status: "pending"

        });


        // ========================================
        // SUCCESS RESPONSE
        // ========================================

        return res.status(201).json({

            message: "Application submitted successfully.",

            application

        });


    } catch (error) {

        console.error(
            "DRIVER APPLICATION ERROR:",
            error
        );

        return res.status(500).json({

            message: error.message

        });

    }

};