import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const [allCourses, setAllCourses] = useState([]);
    const navigate = useNavigate();
    const [isEducator, setIsEducator] = useState(true);

    // Function to calculate average rating of a course
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        const totalRating = course.courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return totalRating / course.courseRatings.length;
    }

    // Function to calculate total time of a chapter (in minutes)
    const calculateChapterTime = (chapter) => {
        let time = 0;
        // Check if chapterContent exists and sum up the durations
        chapter.chapterContent.forEach((lecture) => {
            time += lecture.lectureDuration || 0;
        });
        return time;
    }

    // Function to calculate total course duration (Sum of all chapters)
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach((chapter) => {
            time += calculateChapterTime(chapter);
        });
        
        // Return a formatted string or raw number (Assuming minutes here)
        return time; 
    }

    // Function to calculate total number of lectures in a course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    }

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const value = {
        currency, 
        allCourses,
        setAllCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}