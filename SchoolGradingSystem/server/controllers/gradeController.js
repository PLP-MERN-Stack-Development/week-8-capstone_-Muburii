const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// ➕ POST /grades → Add grade
const addGrade = async (req, res) => {
  try {
    const { studentId, subjectId, term, score } = req.body;

    // Check student and subject exist
    const student = await Student.findById(studentId);
    const subject = await Subject.findById(subjectId);
    const classId = student.className?._id; 

    if (!student || !subject) {
      return res.status(404).json({ message: 'Student or subject not found' });
    }

    // Check if this grade already exists for same student/subject/term
    const existing = await Grade.findOne({
      student: studentId,
      subject: subjectId,
      term,
    });

    if (existing) {
      return res.status(400).json({ message: 'Grade already exists for this subject and term' });
    }

    const newGrade = new Grade({
      student: studentId,
      subject: subjectId,
      term,
      score,
      class: classId
    });

    await newGrade.save();

    res.status(201).json(newGrade);
  } catch (error) {
    console.error('Error adding grade:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📄 GET /grades/student/:id → View specific student’s grades
const getGradesByStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const grades = await Grade.find({ student: id })
      .populate('subject', 'name')
      .sort({ term: 1 });

    if (!grades.length) {
      return res.status(404).json({ message: 'No grades found for this student' });
    }

    res.status(200).json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📄 GET /grades → View all grades (optional)
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'name admNo className')
      .populate('subject', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(grades);
  } catch (error) {
    console.error('Error fetching all grades:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// 📊 GET /grades/class/:classId/averages
const getClassSubjectAverages = async (req, res) => {
  try {
    const { classId } = req.params;
    const { subjectId } = req.query;

    // Get students in the class
    const students = await Student.find({ className: classId }).select('_id');
    const studentIds = students.map(s => s._id);

    if (!studentIds.length) {
      return res.status(404).json({ message: 'No students found in this class' });
    }

    // Build match query
    const match = {
      student: { $in: studentIds },
    };
    if (subjectId) {
      match.subject = subjectId;
    }

    // Aggregate average scores
    const averages = await Grade.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$subject',
          averageScore: { $avg: '$score' },
          gradeCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject',
        },
      },
      {
        $unwind: '$subject',
      },
      {
        $project: {
          subjectName: '$subject.name',
          averageScore: { $round: ['$averageScore', 2] },
          gradeCount: 1,
        },
      },
    ]);

    res.status(200).json(averages);
  } catch (error) {
    console.error('Error calculating averages:', error);
    res.status(500).json({ message: 'Server error calculating averages' });
  }
};

module.exports = {
  addGrade,
  getGradesByStudent,
  getAllGrades,
  getClassSubjectAverages,
};
