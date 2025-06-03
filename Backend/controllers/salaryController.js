import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

const addSalary = async (req, res) => {
  try {
    const { employeeId, department, basicSalary, allowance, deductions, payDate } = req.body;

    // Convert string values to numbers
    const basicSalaryNum = Number(basicSalary);
    const allowanceNum = Number(allowance);
    const deductionsNum = Number(deductions);

    // Calculate net salary
    const netSalary = basicSalaryNum + allowanceNum - deductionsNum;

    const newSalary = new Salary({
      employeeId,
      department,
      basicSalary: basicSalaryNum,
      allowance: allowanceNum,
      deductions: deductionsNum,
      netSalary,
      payDate,
    });

    await newSalary.save();
    return res.status(200).json({ 
      success: true, 
      message: "Salary added successfully" 
    });
  } catch (error) {
    console.error("Error adding salary:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Salary add server error",
    });
  }
};

// Get salary by employee ID
const getSalaryByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const salary = await Salary.findOne({ employeeId })
      .populate('employeeId')
      .populate('department');

    if (!salary) {
      return res.status(404).json({
        success: false,
        error: "No salary record found for this employee"
      });
    }

    return res.status(200).json({
      success: true,
      salary
    });
  } catch (error) {
    console.error("Error fetching salary:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error fetching salary details"
    });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;

    // First try to find the employee record
    let employee = await Employee.findById(id);
    
    // If not found by ID, try to find by userId (for employee dashboard)
    if (!employee) {
      employee = await Employee.findOne({ userId: id });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    // Find all salaries for this employee
    const salaries = await Salary.find({ employeeId: employee._id })
      .populate({
        path: 'employeeId',
        select: 'employeeid userId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .populate('department', 'dep_name')
      .sort({ payDate: -1 }); // Sort by pay date in descending order

    return res.status(200).json({
      success: true,
      salary: salaries,
    });
  } catch (error) {
    console.error("Error fetching salaries:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Salary fetch server error",
    });
  }
};

export { addSalary, getSalaryByEmployee, getSalary };
