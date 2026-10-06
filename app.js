import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import driverRoutes from "./routes/driverRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import driverApplicationRoutes from "./routes/driverApplicationRoutes.js"
import dotenv from "dotenv";
dotenv.config();
import hrRoutes from "./routes/hrRoutes.js";


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

//============Routes=========================


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/driver-applications", driverApplicationRoutes);
app.use("/api/hr", hrRoutes);

export default app;