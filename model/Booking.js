import pool from "../config/database.js";
import { randomUUID } from "crypto";

class Booking {

    static async createBooking({
        customer_id,
        pickup_location,
        dropoff_location,
        pickup_datetime,
        passengers,
        vehicle_type,
        special_instructions
    }) {

        const id = randomUUID();

        await pool.execute(
            `INSERT INTO bookings
            (
                id,
                customer_id,
                pickup_location,
                dropoff_location,
                pickup_datetime,
                passengers,
                vehicle_type,
                special_instructions
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                customer_id,
                pickup_location,
                dropoff_location,
                pickup_datetime,
                passengers || 1,
                vehicle_type || "Sedan",
                special_instructions || null
            ]
        );

        return this.getBookingById(id);
    }


    static async getBookingById(id) {

        const [rows] = await pool.execute(
            `SELECT *
             FROM bookings
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        return rows[0] || null;
    }


    static async getBookingByCustomerId(customer_id) {

        const [rows] = await pool.execute(
            `SELECT *
             FROM bookings
             WHERE customer_id = ?
             ORDER BY pickup_datetime ASC`,
            [customer_id]
        );

        return rows;
    }


    static async updateBooking(id, updatedBooking) {

        const allowedFields = [
            "pickup_location",
            "dropoff_location",
            "pickup_datetime",
            "passengers",
            "vehicle_type",
            "special_instructions",
            "booking_status"
        ];

        const fields = [];
        const values = [];

        for (const field of allowedFields) {

            if (updatedBooking[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(updatedBooking[field]);
            }
        }

        if (fields.length === 0) {
            return this.getBookingById(id);
        }

        values.push(id);

        await pool.execute(
            `UPDATE bookings
             SET ${fields.join(", ")},
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            values
        );

        return this.getBookingById(id);
    }


    static async deleteBooking(id) {

        const [result] = await pool.execute(
            `DELETE FROM bookings
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }


    static async getAllBookings() {

        const [rows] = await pool.execute(
            `SELECT *
             FROM bookings
             ORDER BY created_at DESC`
        );

        return rows;
    }


    static async assignDriver(id, driver_id) {

        await pool.execute(
            `UPDATE bookings
             SET
                driver_id = ?,
                booking_status = 'Driver Assigned',
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [driver_id, id]
        );

        return this.getBookingById(id);
    }


    static async getDriverBookings(driver_id) {

        const [rows] = await pool.execute(
            `SELECT *
             FROM bookings
             WHERE driver_id = ?
             ORDER BY pickup_datetime ASC`,
            [driver_id]
        );

        return rows;
    }


    static async updateBookingStatus(id, booking_status) {

        await pool.execute(
            `UPDATE bookings
             SET
                booking_status = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [booking_status, id]
        );

        return this.getBookingById(id);
    }
}

export default Booking;