import User from '../models/User.js';

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