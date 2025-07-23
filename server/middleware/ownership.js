// middleware/ownership.js
const Student = require('../models/Student');

const checkTeacherOwnership = async (req, res, next) => {
  try {
    // Get teacher ID from authenticated user
    const teacherId = req.user.teacherId?._id || req.user.teacherId;
    
    if (!teacherId) {
      return res.status(403).json({ message: 'Teacher identification missing' });
    }

    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check ownership using createdBy
    if (String(student.createdBy) !== String(teacherId)) {
      return res.status(403).json({ 
        message: 'Unauthorized access to student data'
      });
    }

    req.student = student;
    next();
  } catch (err) {
    console.error('Ownership check error:', err);
    res.status(500).json({ message: 'Server error during ownership verification' });
  }
};

module.exports = {
  checkTeacherOwnership
};