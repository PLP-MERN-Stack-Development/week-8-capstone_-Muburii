// controllers/teacherController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');

// 1. Add Student
const addStudent = async (req, res) => {
  try {
    const { name, admNo, email, classId } = req.body;

    const student = new Student({ name, admNo, classId });
    await student.save();

    const hashedPassword = await bcrypt.hash(admNo, 10); // default password is admNo
    const user = new User({
      email,
      password: hashedPassword,
      role: 'student',
      studentId: student._id,
    });
    await user.save();

    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add student', error });
  }
};

// 2. Add Parent and link to Student
const addParent = async (req, res) => {
  try {
    const { name, email, phone, studentId } = req.body;

    const parent = new Parent({ name, email, phone, student: studentId });
    await parent.save();

    const hashedPassword = await bcrypt.hash(phone, 10); // default password is phone
    const user = new User({
      email,
      password: hashedPassword,
      role: 'parent',
      parentId: parent._id,
      studentId,
    });
    await user.save();

    res.status(201).json({ message: 'Parent added and linked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add parent', error });
  }
};

// 3. Get All Students
const getAllStudents = async (req, res) => {
  try {
    const teacherId = req.user.teacherId?._id || req.user.teacherId;

    // Only get students created by this teacher and are active
    const students = await Student.find({ 
      createdBy: teacherId, 
      isActive: true 
    }).populate('className');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};
// 4. Get All Parents
const getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate('student');
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch parents' });
  }
};

// 5. Create Class
const createClass = async (req, res) => {
  try {
    const { name } = req.body;
    const newClass = new Class({ name });
    await newClass.save();
    res.status(201).json({ message: 'Class created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create class' });
  }
};

// 6. Create Subject
const createSubject = async (req, res) => {
  try {
    const { name, classId } = req.body;
    const subject = new Subject({ name, classId });
    await subject.save();
    res.status(201).json({ message: 'Subject created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subject' });
  }
};

// 7. Assign Grades
const assignGrade = async (req, res) => {
  try {
    const { studentId, subjectId, marks, term } = req.body;
    const grade = new Grade({ student: studentId, subject: subjectId, marks, term });
    await grade.save();
    res.status(201).json({ message: 'Grade assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign grade' });
  }
};

module.exports = {
  addStudent,
  addParent,
  getAllStudents,
  getAllParents,
  createClass,
  createSubject,
  assignGrade,
};