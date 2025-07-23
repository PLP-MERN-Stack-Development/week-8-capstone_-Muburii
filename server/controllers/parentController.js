const Parent = require('../models/Parent');
const Student = require('../models/Student');

// 👨‍👩‍👧 GET /api/parents/profile
const getParentProfile = async (req, res) => {
  try {
    const parentUserId = req.user.id;

    const parent = await Parent.findOne({ userId: parentUserId }).populate('children', 'name admNo className');

    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    res.status(200).json({
      _id: parent._id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      children: parent.children, // ✅ changed from `studentId`
    });

  } catch (error) {
    console.error('Error fetching parent profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// 👨‍👩‍👧 GET /api/parents/children/:id/grades
const getChildGrades = async (req, res) => {
  try {
    const parentUserId = req.user.id;
    const studentId = req.params.id;

    const parent = await Parent.findOne({ userId: parentUserId });

    if (!parent || !parent.children.includes(studentId)) {
      return res.status(403).json({ message: 'Unauthorized access to child grades' });
    }

    const student = await Student.findById(studentId)
      .populate('grades.subject', 'name')
      .populate('className', 'name');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      _id: student._id,
      name: student.name,
      admNo: student.admNo,
      className: student.className,
      grades: student.grades,
    });

  } catch (error) {
    console.error('Error fetching child grades:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// 👨‍👩‍👧 GET /api/parents/child
const getChildProfile = async (req, res) => {
  try {
    const parentUserId = req.user.id;

    const parent = await Parent.findOne({ userId: parentUserId });

    if (!parent || !parent.children || parent.children.length === 0) {
      return res.status(404).json({ message: 'No students linked to parent' });
    }

    const students = await Student.find({ _id: { $in: parent.children } })
      .populate('className', 'name')
      .populate('grades.subject', 'name');

    res.status(200).json(students);

  } catch (error) {
    console.error('Parent Access Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getParentProfile,
  getChildGrades,
  getChildProfile,
};
