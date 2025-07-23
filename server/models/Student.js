const mongoose = require('mongoose');
const gradeSchema = require('./Grade'); 

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admNo: { type: String, required: true, unique: true },
  email: String,
  className: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  grades: [gradeSchema], // ✅ Embedded subdocuments
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
