import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY || '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();
    const { user } = useUser();

    // --- State Management ---
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);

    // --- Helper Logic ---
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) return 0;
        const totalRating = course.courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return (totalRating / course.courseRatings.length).toFixed(1); 
    }

    const calculateChapterTime = (chapter) => {
        return chapter.chapterContent.reduce((time, lecture) => time + (lecture.lectureDuration || 0), 0);
    }

    const calculateCourseDuration = (course) => {
        return course.courseContent.reduce((time, chapter) => time + calculateChapterTime(chapter), 0);
    }

    const calculateNoOfLectures = (course) => {
        return course.courseContent.reduce((total, chapter) => {
            return total + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0);
        }, 0);
    }

    // --- API Functions ---

    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/course/all`);
            if (data.success) {
                setAllCourses(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUserData = async () => {
        if (!isSignedIn || !user) return;

        if (user.publicMetadata?.role === 'educator') {
            setIsEducator(true);
        }

        try {
            const token = await getToken(); 
            
            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchAllCourses();
    }, []);

    useEffect(() => {
        if (isSignedIn && user) {
            
            // =========================================================
            // TEMPORARY: TOKEN LOGGING FOR POSTMAN TESTING
            // REMOVE THIS BLOCK BEFORE PRODUCTION
            // =========================================================
            getToken().then((token) => {
                console.log("--- DEBUG: CLERK TOKEN FOR POSTMAN ---");
                console.log(token);
                console.log("---------------------------------------");
            });
            // =========================================================

            fetchUserData();
            fetchUserEnrolledCourses();
        }
    }, [isSignedIn, user]);

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
        enrolledCourses,
        setEnrolledCourses,
        userData,
        setUserData,
        getToken,
        fetchAllCourses,
        fetchUserData,
        fetchUserEnrolledCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}