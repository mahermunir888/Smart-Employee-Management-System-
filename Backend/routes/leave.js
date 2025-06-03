import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave, getLeave, getleaves, getleaveDetail, updateLeaveStatus } from '../controllers/leaveController.js';

const router = express.Router()

router.post("/add", authMiddleware, addLeave);
router.get("/:id", authMiddleware, getLeave);
router.get('/detail/:id', authMiddleware, getleaveDetail)
router.get('/', authMiddleware, getleaves)
router.put('/status/:id', authMiddleware, updateLeaveStatus)

export default router