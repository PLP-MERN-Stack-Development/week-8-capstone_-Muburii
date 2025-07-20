// controllers/gradeController.js
const Grade = require("../models/gradeModel");

// @desc    Add a new grade (teacher only)
// @route   POST /api/grades
exports.addGrade = async (req, res) => {
  try {
    const grade = new Grade(req.body);
    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get a specific grade by ID
// @route   GET /api/grades/:id
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate("studentId", "name") // optionally populate
      .populate("teacherId", "name");
    
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a grade
// @route   PUT /api/grades/:id
exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!grade) return res.status(404).json({ message: "Grade not found" });

    res.json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a grade
// @route   DELETE /api/grades/:id
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    res.json({ message: "Grade deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
