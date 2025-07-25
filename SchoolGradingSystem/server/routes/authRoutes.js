const express = require('express');
const router = express.Router();
const { login, SignupTeacher, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// POST /auth/login — any role
router.post('/login', login);

// POST /auth/signup — only for teachers
router.post('/signup', SignupTeacher);

// GET /auth/me
router.get('/me', requireAuth(['student', 'teacher', 'parent']), getMe); 

module.exports = router;
