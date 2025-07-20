const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher who assigned the grade
    subject: { type: String, required: true, trim: true }, // e.g., "Mathematics"
    score: { type: Number, required: true, min: 0, max: 100 },
    remarks: { type: String, default: "" }, // e.g., "Excellent work"
    term: { type: String, required: true }, // e.g., "Term 1", "Semester 2"
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grade", gradeSchema);
