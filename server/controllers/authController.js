// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

// Unified Login
const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find user by email or admission number
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { 'studentId.admNo': identifier }
      ]
    }).populate('studentId');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    res.json({ 
      token,
      role: user.role,
      userId: user._id,
      profileId: user[`${user.role}Id`]
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Registration
const registerTeacher = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Check if user exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create teacher profile
    const teacher = new Teacher({ name, email, phone });
    await teacher.save();

    // Create user account
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      role: 'teacher',
      teacherId: teacher._id
    });

    await user.save();

    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
};
// Get logged-in user profile
const getMe = async (req, res) => {
  try {
    // User is attached to request by auth middleware
    const user = req.user;
    
    // Respond with user information (without password)
    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      profileId: user[`${user.role}Id`]
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, registerTeacher, getMe };