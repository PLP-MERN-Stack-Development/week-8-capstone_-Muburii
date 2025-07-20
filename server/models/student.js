const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // One profile per user
    classLevel: { type: String, required: true }, // e.g., "Form 3", "Grade 8"
    enrollmentDate: { type: Date, default: Date.now },
    gpa: { type: Number, default: 0, min: 0, max: 4.0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Student", studentSchema);
