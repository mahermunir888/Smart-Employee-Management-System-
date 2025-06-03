import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import connectToDatabase from './db/db.js'
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import attendanceRouter from './routes/attendanceRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
console.log('Serving static files from:', path.join(__dirname, 'public', 'uploads'));
console.log('Uploads directory:', uploadsDir);

app.use('/api/auth', authRoutes)
app.use('/api/department',departmentRouter)
app.use('/api/employee',employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting', settingRouter)
app.use('/api/attendance', attendanceRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the server at http://192.168.100.19:${PORT}`);
})



