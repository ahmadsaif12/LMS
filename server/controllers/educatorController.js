import { clerkClient } from '@clerk/express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { v2 as cloudinary } from 'cloudinary';

export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = req.auth(); 

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: 'educator' },
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { role: 'educator' },
            { new: true }
        );

        res.json({ 
            success: true, 
            message: 'You are now an educator! You can now publish courses.' 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body; 
        const imageFile = req.file;
        const { userId } = req.auth(); 

        let parsedData;
        if (typeof courseData === 'string') {
            parsedData = JSON.parse(courseData);
        } else {
            parsedData = req.body;
        }

        if (!parsedData || Object.keys(parsedData).length === 0) {
            return res.json({ success: false, message: "No course data found." });
        }
        let finalThumbnailUrl = parsedData.image; 
        delete parsedData.image; 

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            });
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

// --- Get Educator Courses ---
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = req.auth(); 

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const courses = await Course.find({ educator: userId }).sort({ createdAt: -1 });
        
        res.json({ success: true, courses });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};