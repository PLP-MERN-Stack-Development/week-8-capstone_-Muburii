// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['teacher', 'parent', 'student'],
    required: true,
  },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);