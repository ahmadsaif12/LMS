import User from '../models/User.js';
import CourseProgress from '../models/CourseProgress.js';
import Course from '../models/Course.js';
import stripe from '../configs/stripe.js';
import Purchase from '../models/Purchase.js';
export const getUserData = async (req, res) => {
    try {
        
        const userId = req.auth.userId; 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not in database. Ensure Webhook is synced.' });
        }
        
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses');
        
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// 3. Purchase Course (Stripe Integration)
export const PurchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.auth.userId;
        const origin = req.get('origin');

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const finalPrice = course.coursePrice - (course.coursePrice * course.discount) / 100;
        const amountInCents = Math.round(finalPrice * 100);

        const newPurchase = await Purchase.create({
            courseId,
            userId,
            amount: Number(finalPrice.toFixed(2)), 
            status: 'pending'
        });

        const session = await stripe.checkout.sessions.create({
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

// 4. Update Progress (Fixes duplication check)
export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId; 
        const { courseId, lectureId } = req.body;

        let progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Lecture already completed" });
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        } else {
            progressData = await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        }

        res.json({ success: true, message: "Progress updated", progressData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserCourseProgress = async (req, res) => {
    try {
         const userId = req.auth.userId; 
         const { courseId } = req.body; 
         
         let progressData = await CourseProgress.findOne({ userId, courseId });
         res.json({ success: true, progressData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addUserRating = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const existingRatingIndex = course.ratings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            course.ratings[existingRatingIndex].rating = rating;
        } else {
            course.ratings.push({ userId, rating });
        }

        await course.save();
        res.status(200).json({ success: true, message: "Rating updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};