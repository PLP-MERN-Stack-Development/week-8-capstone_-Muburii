// controllers/studentController.js
const Student = require("../models/studentModel");
const Grade = require("../models/gradeModel");

// @desc    Create student profile (after user registers)
// @route   POST /api/students
exports.createStudentProfile = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get student profile by ID
// @route   GET /api/students/:id
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("userId", "-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
exports.updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all grades for student
// @route   GET /api/students/:id/grades
exports.getStudentGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.id }).sort({ date: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get GPA for student
// @route   GET /api/students/:id/gpa
exports.getStudentGPA = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.id });

    if (grades.length === 0) {
      return res.json({ gpa: 0 });
    }

    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    const gpa = (total / grades.length / 25).toFixed(2); // Example: 100 = 4.0 scale

    res.json({ gpa });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
