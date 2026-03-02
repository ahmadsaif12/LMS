import express from 'express';
import { addUserRating, getUserCourseProgress, getUserData, PurchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post("/purchase",PurchaseCourse);
userRouter.post('/update-course-progress',updateUserCourseProgress);
userRouter.get("/get-course-progress",getUserCourseProgress);
userRouter.post('add-ratings',addUserRating);

export default userRouter;