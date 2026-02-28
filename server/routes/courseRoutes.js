import express from 'express';
import { 
    getAllCoursesData, 
    getCourseById, 
    PurchaseCourse 
} 
from '../controllers/courseController.js';

const courseRouter = express.Router();
courseRouter.get('/all', getAllCoursesData);
courseRouter.get('/:id', getCourseById);
courseRouter.post('/purchase', PurchaseCourse);

export default courseRouter;