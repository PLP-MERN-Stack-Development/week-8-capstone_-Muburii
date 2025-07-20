require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Assuming your DB file is at config/db.js

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "UP",
    database: dbStatus,
    timestamp: new Date()
  });
});

// Routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/users", require("./routes/userroutes"));
app.use("/api/students", require("./routes/studentroutes"));
app.use("/api/grades", require("./routes/graderoutes"));
app.use("/api/parents", require("./routes/parentroutes"));
app.use("/api/dashboard", require("./routes/dashboardroutes"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
