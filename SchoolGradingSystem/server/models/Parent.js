const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Their kids
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }, // Teacher who added them
}, { timestamps: true });

module.exports = mongoose.model('Parent', parentSchema);
