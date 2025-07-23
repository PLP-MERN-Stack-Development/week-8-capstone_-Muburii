const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
