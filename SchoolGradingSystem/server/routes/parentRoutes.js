const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getParentProfile,
  getChildGrades,
  getChildProfile,
} = require('../controllers/parentController');

// All parent routes are protected
router.use(requireAuth(['parent']));

// 👨‍👩‍👧 GET /api/parents/profile
router.get('/profile', getParentProfile);

// 👨‍👩‍👧 GET /api/parents/child
router.get('/child', getChildProfile);

// 👨‍👩‍👧 GET /api/parents/children/:id/grades
router.get('/children/:id/grades', getChildGrades);

module.exports = router;
