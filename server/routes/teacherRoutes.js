const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { checkTeacherOwnership } = require('../middleware/ownership');

const teacherController = require('../controllers/teacherController');
const studentController = require('../controllers/studentController');

router.use(requireAuth(['teacher']));

// 🧑‍🏫 TEACHER ACTIONS ON STUDENTS
router.post('/students', studentController.addStudent);
router.get('/students', studentController.getAllStudents);
router.get('/students/:studentId', checkTeacherOwnership, studentController.getStudentById);
router.put('/students/:studentId', checkTeacherOwnership, studentController.updateStudent);
router.delete('/students/:studentId', checkTeacherOwnership, studentController.deleteStudent);

// 🧑‍🏫 TEACHER ASSIGNS GRADES
router.post('/students/:studentId/grades', checkTeacherOwnership, studentController.addGrade);

// 🧑‍🏫 PARENTS
router.post('/parents', teacherController.addParent);
router.get('/parents', teacherController.getAllParents);

// 🧑‍🏫 CLASSES & SUBJECTS
router.post('/classes', teacherController.createClass);
router.post('/subjects', teacherController.createSubject);
router.get('/analytics/averages', teacherController.getClassSubjectAverages);


module.exports = router;
