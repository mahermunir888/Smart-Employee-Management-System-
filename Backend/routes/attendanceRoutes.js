import express from 'express';
import { markAttendance, getAttendance, getAllAttendance } from '../controllers/attendanceController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to mark attendance
router.post('/mark', verifyUser, markAttendance);

// Route to get attendance for an employee
router.get('/:employeeId', verifyUser, getAttendance);

// Route to get all attendance records
router.get('/', verifyUser, getAllAttendance);

export default router; 