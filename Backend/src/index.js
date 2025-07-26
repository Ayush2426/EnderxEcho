import agoraRoutes from "./routes/agora.route.js";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// --- Basic Middleware ---
dotenv.config();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", //frontend dev server
    credentials: true,
  })
);

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// --- API Routes ---
// All API routes should be defined BEFORE the frontend serving logic.
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/agora", agoraRoutes)
// --- Frontend Serving Logic (for Production) ---
// This block should come AFTER all API routes.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "Frontend", "dist")));

  // Catch-all route to serve the main HTML file for any non-API GET request
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
  });
}

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});