const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { checkTeacherOwnership } = require('../middleware/ownership');
const {
  addStudent,
  addGrade,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getMyProfile,
} = require('../controllers/studentController');

// 🧑‍🎓 GET /students/me – Student views their own profile
router.get('/me', requireAuth(['student']), getMyProfile);

// 👨‍🏫 All routes below require teacher access
router.use(requireAuth(['teacher']));

// Student CRUD
router.post('/', addStudent);              // POST /students
router.get('/', getAllStudents);           // GET /students
router.get('/:id', checkTeacherOwnership, getStudentById);    // GET /students/:id
router.put('/:id', checkTeacherOwnership, updateStudent);     // PUT /students/:id
router.delete('/:id', checkTeacherOwnership, deleteStudent);  // DELETE /students/:id

// Grade creation
router.post('/:studentId/grades', checkTeacherOwnership, addGrade); // POST /students/:studentId/grades

module.exports = router;
