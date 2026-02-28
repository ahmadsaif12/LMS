import express from "express";
import { updateRoleToEducator, addCourse,getEducatorCourses } from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const educatorRouter = express.Router();

educatorRouter.post('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);

export default educatorRouter;