import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, default: false },
    lectureOrder: { type: Number, required: true }
}, { _id: false });

const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema]
}, { _id: false });

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    courseContent: [chapterSchema],
    courseRatings: [
        {
            userId: { type: String },
            rating: { type: Number, min: 1, max: 5 }
        }
    ],
    enrolledStudents: [
        { type: String, ref: 'User' }
    ],
    educator: { type: String, ref: 'User', required: true }, 
    createdAt: { type: Number, default: Date.now },
}, { minimize: false });

const Course = mongoose.models.course || mongoose.model('course', courseSchema);

export default Course;