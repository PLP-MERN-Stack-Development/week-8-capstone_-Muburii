const Grade = require("../models/grade");
const Student = require("../models/student");
const User = require("../models/user");

// STUDENT DASHBOARD
// @route   GET /api/dashboard/student
exports.studentDashboard = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.user.id });
    const total = grades.reduce((acc, g) => acc + g.score, 0);
    const gpa = grades.length ? (total / grades.length / 25).toFixed(2) : 0;

    res.json({ grades, gpa });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// TEACHER DASHBOARD
// @route   GET /api/dashboard/teacher
exports.teacherDashboard = async (req, res) => {
  try {
    const gradesGiven = await Grade.find({ teacherId: req.user.id });
    const uniqueStudents = new Set(gradesGiven.map(g => g.studentId.toString()));

    res.json({
      totalGraded: gradesGiven.length,
      studentsGraded: uniqueStudents.size,
      subjectsHandled: [...new Set(gradesGiven.map(g => g.subject))]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// PARENT DASHBOARD
// @route   GET /api/dashboard/parent
exports.parentDashboard = async (req, res) => {
  try {
    const parent = await User.findById(req.user.id);
    const studentId = parent.studentId;

    const student = await Student.findById(studentId);
    const grades = await Grade.find({ studentId });

    const total = grades.reduce((acc, g) => acc + g.score, 0);
    const gpa = grades.length ? (total / grades.length / 25).toFixed(2) : 0;

    res.json({
      student,
      grades,
      gpa
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
