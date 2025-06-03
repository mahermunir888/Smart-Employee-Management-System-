import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

const addLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user.id; 

    
    const employee = await Employee.findOne({ userId: userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    await newLeave.save();

    return res.status(200).json({
      success: true,
      message: "Leave request submitted successfully"
    });
  } catch (error) {
    console.error("Error adding leave:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Leave submission failed"
    });
  }
};

const getLeave = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Fetching leaves for ID:", id);
    let employee;

    // First try to find by userId
    employee = await Employee.findOne({ userId: id });
    console.log("Search by userId result:", employee);
    
    // If not found, try to find by _id
    if (!employee) {
      employee = await Employee.findById(id);
      console.log("Search by _id result:", employee);
    }

    if (!employee) {
      console.log("No employee found for ID:", id);
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    console.log("Found employee:", employee._id);
    const leaves = await Leave.find({ employeeId: employee._id });
    console.log("Found leaves:", leaves.length);
    
    return res.status(200).json({
      success: true,
      leaves
    });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch leaves"
    });
  }
};

const getleaves = async (req, res)=>{
    try {
    
      const leaves = await Leave.find().populate({
        path: "employeeId",
        populate: [
          {
            path: 'department',
            select: 'dep_name'
          },
          {
            path: 'userId',
            select: 'name'
          },
        ]
      })
    
    return res.status(200).json({success: true, leaves});
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch leaves"
    });
  }
};
const getleaveDetail = async (req, res)=>{
const {id} = req.params;
  try {
    
      const leave = await Leave.findById(id).populate({
        path: "employeeId",
        populate: [
          {
            path: 'department',
            select: 'dep_name'
          },
          {
            path: 'userId',
            select: 'name profileImage'
          },
        ]
      })
    
    return res.status(200).json({success: true, leave});
  } catch (error) {
    console.error("Error fetching leave:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch leave details"
    });
  }

}

const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found"
      });
    }

    leave.status = status;
    await leave.save();

    return res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update leave status"
    });
  }
};

export { addLeave, getLeave, getleaves, getleaveDetail, updateLeaveStatus };
