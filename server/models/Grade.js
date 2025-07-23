const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, default: 100 },
  percentage: Number,
  grade: String, // A+, A, B+, etc.
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // FIXED: Reference Teacher, not User
  examType: { type: String, enum: ['quiz', 'midterm', 'final', 'assignment'], default: 'quiz' },
  term: { type: String, enum: ['1st', '2nd', '3rd'] },
  academicYear: String,
  dateRecorded: { type: Date, default: Date.now }
});

// Auto-calculate percentage and grade for embedded grades
gradeSchema.pre('save', function(next) {
  this.percentage = (this.score / this.totalMarks) * 100;
  
  const percentage = this.percentage;
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B+';
  else if (percentage >= 60) this.grade = 'B';
  else if (percentage >= 50) this.grade = 'C+';
  else if (percentage >= 40) this.grade = 'C';
  else this.grade = 'F';
  
  next();
});