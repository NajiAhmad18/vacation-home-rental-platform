import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import homeroute from './routes/home.route.js'
import bookingRoutes from './routes/booking.routes.js'
import wishlist from './routes/wishlist.routes.js'
import ledger from './routes/ledger.route.js'
import reviewRoutes from './routes/review.routes.js';
import authRoutes from "./routes/auth.route.js";
import userRoute from "./routes/user.routes.js"
import paymentRoutes from './routes/payment.routes.js'
import invoiceHtmlRoutes from "./routes/invoiceHtmlRoutes.routes.js";
import os from "os"

import { connectDB } from './lib/connectDB.js';

const app = express();
const PORT = process.env.PORT || 5000
console.log("ENV TEST:", process.env.CLOUDINARY_API_KEY);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) ?? ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/home", homeroute);
app.use("/api/booking", bookingRoutes);
app.use("/api/wishlist", wishlist);
app.use("/api/ledger", ledger);
app.use("/api/review", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/invoices", express.static(os.tmpdir()));
app.use("/", invoiceHtmlRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running in port ${PORT}`);
});
  