import { clerkClient } from '@clerk/express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import { v2 as cloudinary } from 'cloudinary';

// --- 1. Update User Role to Educator ---
export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = req.auth(); 

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: 'educator' },
        });

        await User.findByIdAndUpdate(userId, { role: 'educator' });

        res.json({ success: true, message: 'You are now an educator!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 2. Add New Course 
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body; 
        const imageFile = req.file;
        const { userId } = req.auth(); 

        let parsedData = typeof courseData === 'string' ? JSON.parse(courseData) : courseData;

        if (!parsedData) {
            return res.json({ success: false, message: "No course data provided" });
        }

        // Handle Thumbnail: 
        let finalThumbnailUrl = parsedData.image; 
        delete parsedData.image; 

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            finalThumbnailUrl = imageUpload.secure_url;
        }

        if (!finalThumbnailUrl) {
            return res.json({ success: false, message: 'Thumbnail is required' });
        }

        const newCourse = new Course({
            ...parsedData,
            educator: userId,
            courseThumbnail: finalThumbnailUrl,
            createdAt: Date.now(),
        });

        await newCourse.save();
        res.json({ success: true, message: 'Course created successfully!' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 3. Get Educator Dashboard Stats (Earnings, Enrollments, Count) ---
export const educatorDashboardData = async (req, res) => {
    try {
        const { userId } = req.auth();

        // Find all courses by this educator
        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, order) => sum + order.amount, 0);
        const totalEnrollments = purchases.length;

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                totalEnrollments,
                totalCourses,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId } = req.auth();

        const educatorCourses = await Course.find({ educator: userId });
        const courseIds = educatorCourses.map(course => course._id);

        const enrolledStudents = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })
        .populate('userId', 'name imageUrl email')
        .populate('courseId', 'courseTitle')
        .sort({ createdAt: -1 });

        res.json({ success: true, enrolledStudents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = req.auth();
        const courses = await Course.find({ educator: userId });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};