import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present'
  }
}, {
  timestamps: true
});

// Add a compound index to prevent duplicate entries for same employee on same date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance; 