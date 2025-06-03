import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/department/departmentList';
import AddDepartment from './components/department/AddDepartment';
import EditDepartment from './components/department/EditDepartment';
import List from './components/employee/List';
import Add from './components/employee/Add';
import View from './components/employee/View';
import Edit from './components/employee/Edit';
import AddSalary from './components/salary/Add';
import ViewSalary from './components/salary/View';
import ProtectedRoute from './components/ProtectedRoute';
import SummaryCard from './components/EmployeeDashboard/Summary';
import LeaveList from './components/Leave/List'
import AddLeave from './components/Leave/Add'
import Setting from './components/EmployeeDashboard/Setting';
import Table from './components/Leave/Table';
import Detail from './components/Leave/Detail';
import Scanner from './components/Attendance/Scanner';
import AttendanceRecords from './pages/AttendanceRecords';
import EmployeeAttendanceRecords from './components/EmployeeDashboard/AttendanceRecords';

function App() {
  return (
  
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRole="Admin">
          <AdminDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<AdminSummary />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="department/:id" element={<EditDepartment />} />
        <Route path="employees" element={<List />} />
        <Route path="add-employee" element={<Add />} />
        <Route path="employees/:id" element={<View />} />
        <Route path="employees/edit/:id" element={<Edit />} />
        <Route path="salary/add" element={<AddSalary />} />
        <Route path="employees/salary/:id" element={<ViewSalary />} />
        <Route path="leaves" element={<Table />} />
        <Route path="leaves/:id" element={<Detail />} />
        <Route path="employees/leaves/:id" element={<LeaveList />} />
        <Route path="setting" element={<Setting />} />
        <Route path="attendance/scan" element={<Scanner />} />
        <Route path="attendance-records" element={<AttendanceRecords />} />
      </Route>

      <Route path="/employee-dashboard" element={
        <ProtectedRoute allowedRole="Employee">
          <EmployeeDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<SummaryCard />} />
        <Route path="profile/:id" element={<View />} />
        <Route path="leaves" element={<LeaveList />} />
        <Route path="add-leave" element={<AddLeave />} />
        <Route path="salary/:id" element={<ViewSalary />} />
        <Route path="setting" element={<Setting />} />
        <Route path="attendance/records" element={<EmployeeAttendanceRecords />} />
      </Route>
    </Routes>
 
  );
}

export default App;
