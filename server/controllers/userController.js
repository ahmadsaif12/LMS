import User from '../models/User.js';
import Course from '../models/Course.js'; 
import Purchase from '../models/Purchase.js';
import CourseProgress from '../models/CourseProgress.js';
import stripeInstance from '../configs/stripe.js';
import mongoose from 'mongoose';

// 1. Get User Data
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth(); 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// 2. Fetch Enrolled Courses
export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth();

        // This line was causing your 500 error because of name mismatch
        const userData = await User.findById(userId).populate('enrolledCourses');
        
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, enrolledCourses: userData.enrolledCourses || [] });
    } catch (e) {
        console.error(" API Error (userEnrolledCourses):", e.message);
        res.status(500).json({ success: false, message: e.message });
    }
};

// 3. Purchase Course (Stripe Integration)
export const PurchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { userId } = req.auth();
        const origin = req.get('origin');

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        const finalPrice = course.coursePrice - (course.coursePrice * course.discount) / 100;
        const amountInCents = Math.round(finalPrice * 100);

        const newPurchase = await Purchase.create({
            courseId,
            userId,
            amount: Number(finalPrice.toFixed(2)), 
            status: 'pending'
        });

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { 
                        name: course.courseTitle, 
                        images: [course.courseThumbnail] 
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/my-enrollments`,
            cancel_url: `${origin}/course/${courseId}`,
            metadata: { 
                purchaseId: newPurchase._id.toString(), 
                courseId: courseId.toString(), 
                userId: userId.toString() 
            } 
        });

        res.json({ success: true, session_url: session.url });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// 4. Update Progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth(); 
        const { courseId, lectureId } = req.body;

        let progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Already completed" });
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        } else {
            progressData = await CourseProgress.create({
                userId, courseId, lectureCompleted: [lectureId]
            });
        }
        res.json({ success: true, progressData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get Progress
export const getUserCourseProgress = async (req, res) => {
    try {
         const { userId } = req.auth(); 
         const { courseId } = req.body; 
         let progressData = await CourseProgress.findOne({ userId, courseId });
         res.json({ success: true, progressData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Add Rating
export const addUserRating = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId, rating } = req.body;
        const course = await Course.findById(courseId);
        
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);
        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            course.courseRatings.push({ userId, rating });
        }
        await course.save();
        res.json({ success: true, message: "Rating updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};