const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Grade 8 Blue"
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // Main teacher assigned
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // All students in this class
  academicYear: { type: String, required: true }, // e.g., "2024", "2025"
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }] // 💡 Added this line
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
