import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new Schema ({
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    department: {type: Schema.Types.ObjectId, ref: 'Department', required: true},
    basicSalary: {type: Number, required: true},
    allowance: {type: Number, required: true},
    deductions: {type: Number, required: true},
    netSalary: {type: Number},
    payDate: {type: Date, required: true},
    createdAt: {type: Date, default: Date.now},
});

const Salary = mongoose.model('Salary', salarySchema);
export default Salary