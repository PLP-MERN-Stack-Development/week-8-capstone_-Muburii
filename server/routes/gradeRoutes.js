const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  addGrade,
  getGradesByStudent,
  getAllGrades,
} = require('../controllers/gradeController');

// 🛡 All routes protected for teachers only
router.use(requireAuth(['teacher']));

// ➕ Add grade
router.post('/', addGrade);

// 📄 Get grades for a student
router.get('/student/:id', getGradesByStudent);

// 📄 Optional: Get all grades
router.get('/', getAllGrades);

module.exports = router;
