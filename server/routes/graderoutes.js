const express = require("express");
const {
  addGrade,
  getGradeById,
  updateGrade,
  deleteGrade
} = require("../controllers/gradeController");

const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/grades
// @desc    Add a new grade
// @access  Private (teacher/admin only)
router.post("/", protect, authorize(["developer", "admin"]), addGrade);

// @route   GET /api/grades/:id
// @desc    Get a grade by ID
// @access  Private (teacher/admin/student/parent)
router.get("/:id", protect, getGradeById);

// @route   PUT /api/grades/:id
// @desc    Update a grade by ID
// @access  Private (teacher/admin only)
router.put("/:id", protect, authorize(["developer", "admin"]), updateGrade);

// @route   DELETE /api/grades/:id
// @desc    Delete a grade by ID
// @access  Private (teacher/admin only)
router.delete("/:id", protect, authorize(["developer", "admin"]), deleteGrade);

module.exports = router;
