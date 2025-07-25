const Subject = require('../models/Subject');

// ➕ Add new subject
const createSubject = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const teacherId = req.user._id; // assuming the logged-in user is a teacher

    // Check for existing subject by code
    const existing = await Subject.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Subject with this code already exists' });
    }

    const newSubject = new Subject({
      name,
      code,
      description,
      teacher: teacherId,
    });

    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// 📄 View all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 }); // alphabetical
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✏️ Edit subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await Subject.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ❌ Delete subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Subject.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject deleted' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};
