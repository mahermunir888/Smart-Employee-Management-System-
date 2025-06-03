import multer from "multer";
import path from "path";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import department from '../models/Department.js'
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup with file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log('Original file:', file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('File being processed:', file);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Add Employee Controller
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "User already registered" });
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : ""
    });
    const savedUser = await newUser.save();

    // Create New Employee
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeid: employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary
    });
    await newEmployee.save();

    return res.status(200).json({ success: true, message: "Employee created successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: "Server error in adding employee" });
  }
};

// Get All Employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', { password: 0 })
      .populate('department');
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error in getEmployees:", error.message);
    return res.status(500).json({ success: false, error: "get employees server error" });
  }
};

// Get Single Employee
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById(id)
      .populate('userId', { password: 0 })
      .populate('department');

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate('userId', { password: 0 })
        .populate('department');

      if (!employee) {
        return res.status(404).json({ 
          success: false, 
          error: "Employee not found" 
        });
      }
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error in getEmployee:", error.message);
    return res.status(500).json({ success: false, error: "get employee server error" });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    console.log('Update request received:');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('Params:', req.params);

    const { id } = req.params;
    const {
      name,
      maritalStatus,
      designation,
      department,
      salary,
    } = req.body;

    console.log('Looking for employee with ID:', id);
    const employee = await Employee.findById(id);
    if (!employee) {
      console.log('Employee not found');
      return res.status(404).json({ success: false, error: "employee not found" });
    }

    console.log('Found employee:', employee);
    console.log('Looking for user with ID:', employee.userId);
    const user = await User.findById(employee.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, error: "user not found" });
    }

    console.log('Found user:', user);

    // Update user with new image if provided
    const updateData = { name };
    if (req.file) {
      console.log('New image file received:', req.file);
      
      // Delete old image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(uploadDir, user.profileImage);
        console.log('Checking for old image at:', oldImagePath);
        if (fs.existsSync(oldImagePath)) {
          console.log('Deleting old image');
          fs.unlinkSync(oldImagePath);
        } else {
          console.log('Old image not found at path:', oldImagePath);
        }
      }
      
      updateData.profileImage = req.file.filename;
      console.log('Setting new profile image:', req.file.filename);
    }

    console.log('Updating user with data:', updateData);

    const updateUser = await User.findByIdAndUpdate(
      employee.userId,
      updateData,
      { new: true }
    );

    console.log('Updated user:', updateUser);

    const updateEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        maritalStatus,
        designation,
        salary,
        department
      },
      { new: true }
    );

    console.log('Updated employee:', updateEmployee);

    if (!updateEmployee || !updateUser) {
      console.log('Update failed - document not found');
      return res.status(404).json({ success: false, error: "document not found" });
    }

    console.log('Update successful');
    return res.status(200).json({ 
      success: true, 
      message: "employee updated",
      employee: updateEmployee,
      user: updateUser
    });

  } catch (error) {
    console.error("Error in updateEmployee:", error);
    return res.status(500).json({ success: false, error: "update employees server error" });
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee to get the userId
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Delete the user's profile image if it exists
    const user = await User.findById(employee.userId);
    if (user && user.profileImage) {
      const imagePath = path.join(uploadDir, user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the user
    await User.findByIdAndDelete(employee.userId);

    // Delete the employee
    await Employee.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({ success: false, error: "Server error in deleting employee" });
  }
};

const fetchEmployeeById = async (req, res)=>{
 const { id } = req.params;
  try {
    const employees = await Employee.find({department: id})
      .populate('userId', { password: 0 })
      .populate('department');
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error in getEmployee:", error.message);
    return res.status(500).json({ success: false, error: "get employeesBygetId server error" });
  }
}

export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, deleteEmployee, fetchEmployeeById }; 