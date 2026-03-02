import express from 'express';
import { 
    getAllCoursesData, 
    getCourseById, 
} 
from '../controllers/courseController.js';

const courseRouter = express.Router();
courseRouter.get('/all', getAllCoursesData);
courseRouter.get('/:id', getCourseById);

export default courseRouter;