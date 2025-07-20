const Student = require("../models/student");
const Grade = require("../models/grade");
const User = require("../models/user");

// Assuming parent's user account has a linked studentId field

// @desc    Get the profile of the linked student
// @route   GET /api/parents/me/student
exports.getLinkedStudentProfile = async (req, res) => {
  try {
    const parentUser = await User.findById(req.user.id);
    if (!parentUser || !parentUser.studentId) {
      return res.status(404).json({ message: "Linked student not found" });
    }

    const student = await Student.findById(parentUser.studentId);
    if (!student) return res.status(404).json({ message: "Student profile not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all grades for the linked student
// @route   GET /api/parents/me/grades
exports.getLinkedStudentGrades = async (req, res) => {
  try {
    const parentUser = await User.findById(req.user.id);
    if (!parentUser || !parentUser.studentId) {
      return res.status(404).json({ message: "Linked student not found" });
    }

    const grades = await Grade.find({ studentId: parentUser.studentId });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};