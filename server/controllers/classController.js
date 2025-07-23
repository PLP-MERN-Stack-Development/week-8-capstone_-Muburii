const Class = require('../models/Class');
const Student = require('../models/Student');

// 📌 Create a new class
const createClass = async (req, res) => {
  try {
    const { name } = req.body;

    const newClass = new Class({ name });
    await newClass.save();

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 Update class by ID
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 Add a student to a class
const addStudentToClass = async (req, res) => {
  try {
    const { id } = req.params; // Class ID
    const { studentId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.className = id; // assign class
    await student.save();

    res.status(200).json({ message: 'Student added to class', student });
  } catch (error) {
    console.error('Error adding student to class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  updateClass,
  addStudentToClass,
};
