require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Import mongoose directly
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error(`MongoDb connection failed: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "UP",
    database: dbStatus,
    timestamp: new Date()
  });
});

// Routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));