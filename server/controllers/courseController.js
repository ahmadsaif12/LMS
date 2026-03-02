import Course from '../models/Course.js';

export const getAllCoursesData = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator', select: 'name imageUrl email' });

        res.json({ success: true, courses });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// 2. Fetch specific course details
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = await Course.findById(id)
            .select('-enrolledStudents')
            .populate({ path: 'educator', select: 'name imageUrl email' });

        if (!courseData) return res.status(404).json({ success: false, message: 'Course not found' });

        let lectures = 0, duration = 0;
        courseData.courseContent.forEach(ch => {
            lectures += ch.chapterContent.length;
            ch.chapterContent.forEach(lec => duration += lec.lectureDuration);
        });

        res.json({ success: true, courseData, totalLectures: lectures, totalDuration: duration });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};