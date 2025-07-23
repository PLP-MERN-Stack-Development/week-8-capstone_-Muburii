const express = require('express');
const router = express.Router();
const { login, registerTeacher, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// POST /auth/login — any role
router.post('/login', login);

// POST /auth/signup — only for teachers
router.post('/signup', registerTeacher);

// GET /auth/me
router.get('/me', requireAuth(['student', 'teacher', 'parent']), getMe); 

module.exports = router;
