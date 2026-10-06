import pool from "../config/database.js";
import { randomUUID } from "crypto";

class User {

    static async createUser({
        firstName,
        lastName,
        email,
        phone,
        hashedPassword,
        role
    }) {

        const id = randomUUID();

        const [result] = await pool.execute(
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
                id,
                firstName,
                lastName,
                email,
                phone,
                hashedPassword,
                role || "customer",
                0
            ]
        );

        return this.findUserById(id);
    }


    static async findUserByEmail(email) {

        const [rows] = await pool.execute(
            `SELECT *
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        return rows[0] || null;
    }


    static async findUserById(id) {

        const [rows] = await pool.execute(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                role,
                created_at,
                is_verified
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        return rows[0] || null;
    }


    static async findByEmail(email) {

        const [rows] = await pool.execute(
            `SELECT *
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        return rows[0] || null;
    }


    static async verifyEmail(email) {

        const [result] = await pool.execute(
            `UPDATE users
             SET is_verified = 1
             WHERE email = ?`,
            [email]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findByEmail(email);
    }

    static async createDriverUser({
    firstName,
    lastName,
    email,
    phone,
    hashedPassword
}) {

    const id = randomUUID();

    await pool.execute(
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
            id,
            firstName,
            lastName,
            email,
            phone,
            hashedPassword,
            "driver",
            1
        ]
    );

    return this.findUserById(id);
}

}

export default User;