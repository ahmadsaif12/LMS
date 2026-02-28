import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js'
import stripe from '../configs/stripe.js';

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
            amount: finalPrice,
            status: 'pending'
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: course.courseTitle, images: [course.courseThumbnail] },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/my-enrollments`,
            cancel_url: `${origin}/course/${courseId}`,
            metadata: { 
                purchaseId: newPurchase._id.toString(), 
                courseId, 
                userId 
            } 
        });

        res.json({ success: true, session_url: session.url });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};