const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { studentDashboard, teacherDashboard, parentDashboard } = require("../controllers/dashboardController");

const router = express.Router();

// @route   GET /api/dashboard/student
// @desc    Get student dashboard summary
// @access  Private (student only)
router.get("/student", protect, authorize(["student"]), studentDashboard);

// @route   GET /api/dashboard/teacher
// @desc    Get teacher dashboard summary
// @access  Private (teacher only)
router.get("/teacher", protect, authorize(["developer", "admin"]), teacherDashboard);

// @route   GET /api/dashboard/parent
// @desc    Get parent dashboard summary
// @access  Private (parent only)
router.get("/parent", protect, authorize(["parent"]), parentDashboard);

module.exports = router;
