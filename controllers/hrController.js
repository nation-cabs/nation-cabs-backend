import DriverApplication from "../model/DriverApplication.js";
import bcrypt from "bcryptjs";
import { generateTemporaryPassword } from "../utils/generateTemporaryPassword.js";
import User from "../model/User.js";
import fs from "fs";
import path from "path";



// ==========================================
// GET ALL DRIVER APPLICATIONS
// ==========================================

export const getDriverApplications = async (req, res) => {

    try {

        const applications =
            await DriverApplication.getApplications();

        res.status(200).json({
            applications
        });

    } catch (error) {

        console.error("GET DRIVER APPLICATIONS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// GET PENDING DRIVER APPLICATIONS
// ==========================================

export const getPendingDriverApplications = async (req, res) => {

    try {

        const applications =
            await DriverApplication.getPendingApplications();

        res.status(200).json({
            applications
        });

    } catch (error) {

        console.error("GET PENDING DRIVER APPLICATIONS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// GET ONE APPLICATION FOR HR REVIEW
// ==========================================

export const getDriverApplicationForReview = async (req, res) => {

    try {

        const { id } = req.params;

        const application =
            await DriverApplication.getApplicationById(id);

        if (!application) {

            return res.status(404).json({
                message: "Driver application not found."
            });
        }


        // ==========================================
        // BUILD DOCUMENT URLs
        // ==========================================

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const documents = {

            idDocument: application.id_document
                ? `${baseUrl}/uploads/${application.id_document}`
                : null,

            licenseDocument: application.license_document
                ? `${baseUrl}/uploads/${application.license_document}`
                : null,

            pdpDocument: application.pdp_document
                ? `${baseUrl}/uploads/${application.pdp_document}`
                : null,

            proofOfAddress: application.proof_of_address
                ? `${baseUrl}/uploads/${application.proof_of_address}`
                : null,

            profilePhoto: application.profile_photo
                ? `${baseUrl}/uploads/${application.profile_photo}`
                : null
        };


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            application,

            documents

        });

    } catch (error) {

        console.error(
            "GET DRIVER APPLICATION REVIEW ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};
// ==========================================
// APPROVE DRIVER APPLICATION
// ==========================================

export const approveDriverApplication = async (req, res) => {
    try {
        const { id } = req.params;

        // ==========================================
        // 1. Generate temporary password
        // ==========================================

        const temporaryPassword =
            generateTemporaryPassword();

        // ==========================================
        // 2. Hash temporary password
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                temporaryPassword,
                12
            );

        // ==========================================
        // 3. Approve application
        //    AND create driver account
        // ==========================================

        const result =
            await DriverApplication
                .approveApplicationAndCreateDriver({
                    applicationId: id,
                    hashedPassword
                });

        // ==========================================
        // 4. Return success
        // ==========================================

        return res.status(200).json({
            message:
                "Application approved and driver account created successfully.",

            user: {
                id: result.user.id,
                first_name: result.user.first_name,
                last_name: result.user.last_name,
                email: result.user.email,
                phone: result.user.phone,
                role: result.user.role
            },

            temporaryPassword
        });

    } catch (error) {

    console.error(
        "APPROVE DRIVER APPLICATION ERROR:",
        error
    );

    if (error.message === "Driver application not found.") {
        return res.status(404).json({
            message: error.message
        });
    }

    if (
        error.message.includes("already") ||
        error.message.includes("already exists")
    ) {
        return res.status(400).json({
            message: error.message
        });
    }

    if (error.message.includes("email")) {
        return res.status(409).json({
            message: error.message
        });
    }

    return res.status(500).json({
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
    });
}
};
//=====================REJECT DRIVER APPLICATION=========================

export const rejectDriverApplication = async (req, res) => {

    try {

        const { id } = req.params;

        const { adminNotes } = req.body;

        const application =
            await DriverApplication.rejectApplication(
                id,
                adminNotes
            );

        if (!application) {

            return res.status(404).json({
                message: "Driver application not found."
            });
        }

        res.status(200).json({
            message: "Driver application rejected.",
            application
        });

    } catch (error) {

        console.error(
            "REJECT APPLICATION ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// CREATE DRIVER ACCOUNT
// ==========================================

export const createDriverAccount = async (req, res) => {

    try {

        const { id } = req.params;

        // 1. Find application
        const application =
            await DriverApplication.getApplicationById(id);

        if (!application) {
            return res.status(404).json({
                message: "Driver application not found."
            });
        }

        // 2. Application must be approved
        if (application.application_status !== "approved") {
            return res.status(400).json({
                message:
                    "The application must be approved before creating a driver account."
            });
        }

        // 3. Prevent duplicate accounts
        if (application.user_id) {
            return res.status(400).json({
                message:
                    "A driver account has already been created for this application."
            });
        }

        // 4. Check whether email already belongs to a user
        const existingUser =
            await User.findUserByEmail(application.email);

        if (existingUser) {
            return res.status(409).json({
                message:
                    "A user account with this email already exists."
            });
        }

        // 5. Generate temporary password
        const temporaryPassword =
            generateTemporaryPassword();

        // 6. Hash password
        const hashedPassword =
            await bcrypt.hash(temporaryPassword, 12);

        // 7. Create driver account
        const user =
            await User.createDriverUser({
                firstName: application.first_name,
                lastName: application.last_name,
                email: application.email,
                phone: application.phone,
                hashedPassword
            });

        // 8. Link application to user
        const linked =
            await DriverApplication.linkUser(
                application.id,
                user.id
            );

        if (!linked) {
            return res.status(500).json({
                message:
                    "Driver account was created but the application could not be linked."
            });
        }

        console.log(
            `Driver account created for ${application.email}`
        );

        res.status(201).json({
            message:
                "Driver account created successfully.",

            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            },

            temporaryPassword
        });

    } catch (error) {

        console.error(
            "CREATE DRIVER ACCOUNT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// ==========================================
// VIEW DRIVER APPLICATION DOCUMENT
// ==========================================

export const getDriverApplicationDocument = async (req, res) => {

    try {

        const { id, documentType } = req.params;


        // ==========================================
        // ALLOWED DOCUMENT TYPES
        // ==========================================

        const documentFields = {

            id: "id_document",

            license: "license_document",

            pdp: "pdp_document",

            "proof-of-address": "proof_of_address",

            "profile-photo": "profile_photo"

        };


        // ==========================================
        // CHECK DOCUMENT TYPE
        // ==========================================

        const databaseField =
            documentFields[documentType];

        if (!databaseField) {

            return res.status(400).json({
                message: "Invalid document type."
            });

        }


        // ==========================================
        // GET APPLICATION
        // ==========================================

        const application =
            await DriverApplication.getApplicationById(id);

        if (!application) {

            return res.status(404).json({
                message: "Driver application not found."
            });

        }


        // ==========================================
        // GET DOCUMENT PATH
        // ==========================================

        const relativePath =
            application[databaseField];

        if (!relativePath) {

            return res.status(404).json({
                message: "Document not uploaded."
            });

        }


        // ==========================================
        // BUILD FULL FILE PATH
        // ==========================================

        const filePath = path.join(
            process.cwd(),
            "uploads",
            relativePath
        );


        // ==========================================
        // SECURITY CHECK
        // ==========================================

        const uploadsDirectory = path.resolve(
            process.cwd(),
            "uploads"
        );

        const resolvedFilePath =
            path.resolve(filePath);

        if (
            !resolvedFilePath.startsWith(
                uploadsDirectory + path.sep
            )
        ) {

            return res.status(403).json({
                message: "Invalid document path."
            });

        }


        // ==========================================
        // CHECK FILE EXISTS
        // ==========================================

        if (!fs.existsSync(resolvedFilePath)) {

            console.error(
                "DOCUMENT FILE NOT FOUND:",
                resolvedFilePath
            );

            return res.status(404).json({
                message: "Document file not found on server."
            });

        }


        // ==========================================
        // DETERMINE CONTENT TYPE
        // ==========================================

        const extension =
            path.extname(resolvedFilePath)
                .toLowerCase();

        const contentTypes = {

            ".pdf": "application/pdf",

            ".jpg": "image/jpeg",

            ".jpeg": "image/jpeg",

            ".png": "image/png"

        };

        const contentType =
            contentTypes[extension] ||
            "application/octet-stream";


        // ==========================================
        // SEND FILE
        // ==========================================

        res.setHeader(
            "Content-Type",
            contentType
        );

        res.setHeader(
            "Content-Disposition",
            "inline"
        );

        return res.sendFile(
            resolvedFilePath
        );

    } catch (error) {

        console.error(
            "GET DRIVER APPLICATION DOCUMENT ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to retrieve document."
        });

    }

};