const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  subjects: [String], // Keep your simple approach
  classes: [String], // Classes they teach
  studentsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Track students they added
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);