import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { toast } from 'react-toastify'; 

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    
    // --- Environment Variables ---
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const navigate = useNavigate();
    
    // --- Clerk Hooks ---
    const { getToken, isSignedIn } = useAuth();
    const { user } = useUser();

    // --- Application States ---
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourse, setEnrolledCourse] = useState([]);

    // --- Helper Calculations (UI Display Logic) ---
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) return 0;
        const totalRating = course.courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return totalRating / course.courseRatings.length;
    }

    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.forEach((lecture) => {
            time += lecture.lectureDuration || 0;
        });
        return time;
    }

    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach((chapter) => {
            time += calculateChapterTime(chapter);
        });
        return time; 
    }

    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // --- API & Data Fetching ---

    // 1. Fetch all courses (Currently from dummy, ready for axios)
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    }

    // 2. Fetch courses user is enrolled in
    const fetchUserEnrolledCourses = async () => {
        setEnrolledCourse(dummyCourses);
    }

    // 3. Become an Educator 
    const becomeEducator = async () => {
        try {
            if (!isSignedIn) {
                return toast.error("Please login to continue");
            }

            // GET THE TOKEN FROM CLERK
            const token = await getToken();
            console.log(" Clerk Session Token Found:", token); 

            // API Call to your Node backend to update role
            const { data } = await axios.post(
                `${backendUrl}/api/educator/update-role`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setIsEducator(true);
                toast.success(data.message);
            } else {
                toast.error(data.message || "Failed to update role");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    // --- Side Effects ---

    // Fetch initial static data
    useEffect(() => {
        fetchAllCourses();
        fetchUserEnrolledCourses();
    }, []);

    // Effect to check and log Clerk Auth state
    useEffect(() => {
        const checkAuthStatus = async () => {
            if (isSignedIn && user) {
                // Log token for manual verification in console
                const token = await getToken();
                console.log("Current User Token:", token);

                // Sync Educator state from Clerk metadata
                if (user.publicMetadata?.role === 'educator') {
                    setIsEducator(true);
                }
            }
        };
        checkAuthStatus();
    }, [isSignedIn, user, getToken]);

    const value = {
        currency, 
        backendUrl,
        allCourses,
        setAllCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,
        enrolledCourse,       
        setEnrolledCourse,
        becomeEducator,
        getToken 
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}