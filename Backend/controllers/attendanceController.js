import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

// Mark attendance for an employee
const markAttendance = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    // First find employee by userId
    const employee = await Employee.findOne({ userId: employeeId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    // Get current date without time
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if attendance already marked for today
    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: "Attendance already marked for today"
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      employeeId: employee._id,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
      status: 'Present'
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully"
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to mark attendance"
    });
  }
};

// Get attendance for an employee
const getAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    console.log('Fetching attendance for employeeId:', employeeId);

    // First find employee by userId
    const employee = await Employee.findOne({ userId: employeeId });
    
    if (!employee) {
      console.log('Employee not found for userId:', employeeId);
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    console.log('Found employee:', employee._id);

    let query = { employeeId: employee._id };

    // Add date range to query if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate({
        path: 'employeeId',
        select: 'employeeid userId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });

    console.log('Found attendance records:', attendance.length);

    return res.status(200).json({
      success: true,
      attendance
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch attendance"
    });
  }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    // Add date range to query if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      console.log('Date range:', { start, end });
      
      query.date = {
        $gte: start,
        $lte: end
      };
    }

    console.log('Query:', query);

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate({
        path: 'employeeId',
        select: 'employeeid userId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });

    console.log('Found attendance records:', attendance.length);

    return res.status(200).json({
      success: true,
      attendance
    });
  } catch (error) {
    console.error("Error fetching all attendance:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch attendance records"
    });
  }
};

export { markAttendance, getAttendance, getAllAttendance }; 