const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
// 🛡 Require teacher auth
router.use(requireAuth(['teacher']));

router.post('/', createSubject);// Add subject
router.get('/', getAllSubjects);// Get all subjects
router.put('/:id', updateSubject);// Update subject by ID
router.delete('/:id', deleteSubject);// DELETE subject by ID

module.exports = router;
