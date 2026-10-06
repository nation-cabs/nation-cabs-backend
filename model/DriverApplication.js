
import pool from "../config/database.js";
import { randomUUID } from "crypto";

class DriverApplication {

    // ==========================================
    // CREATE DRIVER APPLICATION
    // ==========================================

    static async createApplication(applicationData) {

        const id = randomUUID();

        const {
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            gender,
            province,
            city,
            address,
            license_number,
            license_expiry,
            pdp_number,
            pdp_expiry,
            driving_experience,
            emergency_name,
            emergency_relationship,
            emergency_phone,

            // Uploaded documents
            id_document,
            license_document,
            pdp_document,
            proof_of_address,
            profile_photo,
            cv_document,

            // Consent fields
            agree_information,
            agree_background,
            agree_terms,

            // Application status
            application_status,
            admin_notes
        } = applicationData;


        await pool.execute(
            `INSERT INTO driver_applications
            (
                id,
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                province,
                city,
                address,
                license_number,
                license_expiry,
                pdp_number,
                pdp_expiry,
                driving_experience,
                emergency_name,
                emergency_relationship,
                emergency_phone,
                id_document,
                license_document,
                pdp_document,
                proof_of_address,
                profile_photo,
                cv_document,
                agree_information,
                agree_background,
                agree_terms,
                application_status,
                admin_notes
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?,?
            )`,
            [
                id,
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                province,
                city,
                address,
                license_number,
                license_expiry,
                pdp_number,
                pdp_expiry,
                driving_experience,
                emergency_name,
                emergency_relationship,
                emergency_phone,

                id_document || null,
                license_document || null,
                pdp_document || null,
                proof_of_address || null,
                profile_photo || null,
                cv_document || null,
                agree_information ?? false,
                agree_background ?? false,
                agree_terms ?? false,

                application_status || "pending",
                admin_notes || null
            ]
        );


        const [rows] = await pool.execute(
            `SELECT *
             FROM driver_applications
             WHERE id = ?`,
            [id]
        );

        return rows[0];
    }


    // ==========================================
    // GET ALL DRIVER APPLICATIONS
    // ==========================================

    static async getApplications() {

        const [rows] = await pool.execute(
            `SELECT *
             FROM driver_applications
             ORDER BY created_at DESC`
        );

        return rows;
    }


    // ==========================================
    // GET PENDING DRIVER APPLICATIONS
    // ==========================================

    static async getPendingApplications() {

        const [rows] = await pool.execute(
            `SELECT *
             FROM driver_applications
             WHERE application_status = 'pending'
             ORDER BY created_at ASC`
        );

        return rows;
    }


    // ==========================================
    // GET APPLICATION BY ID
    // ==========================================

    static async getApplicationById(id) {

        const [rows] = await pool.execute(
            `SELECT *
             FROM driver_applications
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        return rows[0] || null;
    }


    // ==========================================
    // APPROVE DRIVER APPLICATION
    // ==========================================

    static async approveApplication(id, adminNotes = null) {

        const [result] = await pool.execute(
            `UPDATE driver_applications
             SET
                application_status = 'approved',
                admin_notes = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                adminNotes || null,
                id
            ]
        );


        if (result.affectedRows === 0) {
            return null;
        }


        return this.getApplicationById(id);
    }


    //==========REJECT APPLICATION=========================
    
    static async rejectApplication(id, adminNotes = null) {

    const [result] = await pool.execute(
        `UPDATE driver_applications
         SET
            application_status = 'rejected',
            admin_notes = ?,
            updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
            adminNotes || null,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return this.getApplicationById(id);
}

    // ==========================================
    // LINK APPLICATION TO USER ACCOUNT
    // ==========================================

    static async linkUser(applicationId, userId) {

        const [result] = await pool.execute(
            `UPDATE driver_applications
             SET
                user_id = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                userId,
                applicationId
            ]
        );


        return result.affectedRows > 0;
    }

    static async approveApplicationAndCreateDriver({
    applicationId,
    hashedPassword
}) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // ==========================================
        // 1. Get the application
        // ==========================================

        const [applications] = await connection.execute(
            `SELECT *
             FROM driver_applications
             WHERE id = ?
             LIMIT 1`,
            [applicationId]
        );

        if (applications.length === 0) {
            throw new Error("Driver application not found.");
        }

        const application = applications[0];

        // ==========================================
        // 2. Make sure application is still pending
        // ==========================================

        if (application.application_status !== "pending") {
            throw new Error(
                `Application is already ${application.application_status}.`
            );
        }

        // ==========================================
        // 3. Make sure account doesn't already exist
        // ==========================================

        if (application.user_id) {
            throw new Error(
                "A driver account already exists for this application."
            );
        }

        // ==========================================
        // 4. Check whether email already exists
        // ==========================================

        const [existingUsers] = await connection.execute(
            `SELECT id
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [application.email]
        );

        if (existingUsers.length > 0) {
            throw new Error(
                "A user account with this email already exists."
            );
        }

        // ==========================================
        // 5. Create driver user
        // ==========================================

        const userId = randomUUID();

        await connection.execute(
            `INSERT INTO users
            (
                id,
                first_name,
                last_name,
                email,
                phone,
                password,
                role,
                is_verified
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                application.first_name,
                application.last_name,
                application.email,
                application.phone,
                hashedPassword,
                "driver",
                1
            ]
        );

        // ==========================================
        // 6. Approve application and link user
        // ==========================================

        await connection.execute(
            `UPDATE driver_applications
             SET
                application_status = 'approved',
                user_id = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                userId,
                applicationId
            ]
        );

        // ==========================================
        // 7. Get created user
        // ==========================================

        const [users] = await connection.execute(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                role,
                is_verified,
                created_at
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [userId]
        );

        // ==========================================
        // 8. Commit transaction
        // ==========================================

        await connection.commit();

        return {
            application,
            user: users[0]
        };

    } catch (error) {

        // ==========================================
        // Roll back everything if anything fails
        // ==========================================

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
}

}

export default DriverApplication;
