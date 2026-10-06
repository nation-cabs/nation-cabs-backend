import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("DB CONFIG:");
console.log("HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.DB_PORT);
console.log("NAME:", process.env.DB_NAME);
console.log("USER:", process.env.DB_USER);
console.log("PASSWORD SET:", !!process.env.DB_PASSWORD);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log("✅ MySQL connection successful");
        connection.release();
    })
    .catch(error => {
        console.error("❌ MySQL connection failed:", error.message);
    });

export default pool;