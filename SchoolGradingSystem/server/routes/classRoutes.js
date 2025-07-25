const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  createClass,
  getAllClasses,
  updateClass,
  addStudentToClass,
} = require('../controllers/classController');

// 🛡 Protect all routes for teachers only
router.use(requireAuth(['teacher']));

// 📚 POST /classes → Create a new class
router.post('/', createClass);

// 📚 GET /classes → Get all classes
router.get('/', getAllClasses);

// 📚 PUT /classes/:id → Update a class by ID
router.put('/:id', updateClass);

// ➕ POST /classes/:id/add-student → Add student to class
router.post('/:id/add-student', addStudentToClass);

module.exports = router;
