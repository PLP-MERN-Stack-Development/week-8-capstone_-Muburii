const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const User = require('../models/User');
const Parent = require('../models/Parent');
const Class = require('../models/Class');

// Add a new student (teachers only)
const addStudent = async (req, res) => {
  const { name, admNo, className, parentInfo } = req.body;
  const teacherId = req.user.teacherId;

  try {
    const existingStudent = await Student.findOne({ admNo });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this admission number already exists' });
    }

    // Create parent if provided
    let parentId = null;
    if (parentInfo) {
      const parent = new Parent({ ...parentInfo, createdBy: teacherId });
      await parent.save();
      parentId = parent._id;
    }

    const student = new Student({
      name,
      admNo,
      className,
      parent: parentId,
      createdBy: teacherId
    });
    await student.save();

    const hashedPassword = await bcrypt.hash(admNo, 12);
    const user = new User({
      email: `${admNo}@school.edu`,
      password: hashedPassword,
      role: 'student',
      studentId: student._id
    });
    await user.save();

    if (className) {
      await Class.findOneAndUpdate(
        { name: className, teacher: teacherId },
        { $addToSet: { students: student._id } },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ message: 'Failed to add student', error: err.message });
  }
};

// Get all students (teachers only)
const getAllStudents = async (req, res) => {
  try {
    const teacherId = req.user.teacherId;
    const students = await Student.find({ createdBy: teacherId })
      .populate('parent', 'name email phone')
      .lean();

    res.json({ students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to fetch students', error: err.message });
  }
};

// Get one student by ID (teachers only)
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate('parent', 'name email phone')
      .lean();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ message: 'Failed to fetch student', error: err.message });
  }
};

// Update student (teachers only)
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.createdBy;
    delete updateData._id;

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent', 'name email phone');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Failed to update student', error: err.message });
  }
};

// Delete student (teachers only)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await User.findOneAndDelete({ studentId: id });
    await Class.updateMany({ students: id }, { $pull: { students: id } });

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ message: 'Failed to delete student', error: err.message });
  }
};

// Add a grade to a student (teachers only)
const addGrade = async (req, res) => {
  const { studentId } = req.params;
  const gradeData = req.body;

  try {
    gradeData.teacher = req.user.teacherId;
    gradeData.dateAdded = new Date();

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $push: { grades: gradeData } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Grade added successfully', student });
  } catch (err) {
    console.error('Error adding grade:', err);
    res.status(500).json({ message: 'Failed to add grade', error: err.message });
  }
};

// Student: Get their own profile
const getMyProfile = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const student = await Student.findById(studentId)
      .populate('parent', 'name email phone')
      .populate('className', 'name')
      .populate('grades.subject', 'name')
      .lean();

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.status(200).json({
      _id: student._id,
      name: student.name,
      admNo: student.admNo,
      className: student.className,
      grades: student.grades || [],
      parent: student.parent || null,
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Failed to fetch your profile' });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addGrade,
  getMyProfile
};
