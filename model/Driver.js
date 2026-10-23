import pool from "../config/database.js";

class Driver {
  static async getApprovedDrivers() {
    const [rows] = await pool.execute(
      `SELECT
          u.id AS id,
          da.id AS application_id,
          da.first_name,
          da.last_name,
          da.email,
          da.phone
       FROM driver_applications da
       INNER JOIN users u ON u.id = da.user_id
       WHERE LOWER(da.application_status) = 'approved'
         AND LOWER(u.role) = 'driver'
       ORDER BY da.first_name ASC, da.last_name ASC`
    );

    return rows;
  }
}

export default Driver;