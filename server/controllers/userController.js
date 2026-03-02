import User from '../models/User.js';
import CourseProgress from '../models/CourseProgress.js';

export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.auth().userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// Get enrolled courses with full access (lecture URLs included)
export const userEnrolledCourses = async (req, res) => {
    try {
        const userData = await User.findById(req.auth().userId).populate('enrolledCourses');
        
        if (!userData) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

//update user course progress 
export const updateUserCourseProgress = async (req, res) => {
    try {
        // userId usually lives directly on req.auth or req.user from your middleware
        const userId = req.auth.userId; 
        const { courseId, lectureId } = req.body;

        // Correct way to query: Pass an object with the fields you're looking for
        let progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            // If the lecture is already marked completed, just return
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Lecture already completed" });
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();

        } else {
            // If no progress record exists for this user/course, create a new one
            progressData = await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        }

        res.json({
            success: true,
            message: "Progress updated",
            progressData
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//get user progress

export const getUserCourseProgress = async (req, res) => {
    try {
         const userId = req.auth.userId; 
         const { courseId} = req.body;
         let progressData = await CourseProgress.findOne({ userId, courseId });
         res.json({success:true,progressData});

    }catch(error){
        res.json({success:false,message:error.message})
    }
};

//add user ratings
import Course from '../models/Course.js';

export const addUserRating = async (req, res) => {
    try {
        const userId = req.auth.userId; // Extracted from auth middleware
        const { courseId, rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check if user has already rated this course
        const existingRatingIndex = course.ratings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update existing rating
            course.ratings[existingRatingIndex].rating = rating;
        } else {
            // Add new rating object
            course.ratings.push({ userId, rating });
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            averageRating: calculateAverage(course.ratings) // Optional helper
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

