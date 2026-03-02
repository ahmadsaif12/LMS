import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";
import Signature from "../../components/Signature";

const Player = () => {
    const {
        enrolledCourses,
        calculateChapterTime,
        backendUrl,
        getToken,
        userData,
        fetchUserEnrolledCourses,
    } = useContext(AppContext);
    
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [playerData, setPlayerData] = useState(null);
    const [progressData, setProgressData] = useState(null);
    const [initialRating, setInitialRating] = useState(0);

    const [isLoadingVideo, setIsLoadingVideo] = useState(false);

    // --- STRONGER YOUTUBE ID EXTRACTOR ---
    const getYouTubeId = (url) => {
        if (!url) return "";
        
        // Handle cases where only the ID was stored
        if (url.length === 11 && !url.includes("/")) return url;

        // Regex to capture ID from watch?v=, embed/, shorts/, or youtu.be/
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        
        if (match && match[7].length === 11) {
            return match[7];
        } else {
            // Fallback: try to get the last part if regex fails
            const parts = url.split("/");
            const lastPart = parts[parts.length - 1];
            return lastPart.includes("watch?v=") ? lastPart.split("v=")[1] : lastPart;
        }
    };

    const getCourseData = () => {
        enrolledCourses.map((course) => {
            if (course._id === courseId) {
                setCourseData(course);
                course.courseRatings.map((item) => {
                    if (item.userId === userData?._id) {
                        setInitialRating(item.rating);
                    }
                });
            }
        });
    };

    const toggleSection = (index) => {
        setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    useEffect(() => {
        if (enrolledCourses.length > 0) {
            getCourseData();
        }
    }, [enrolledCourses]);

    const getCourseProgress = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                backendUrl + "/api/user/get-course-progress",
                { courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                setProgressData(data.progressData);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const markLectureAsCompleted = async (lectureId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                backendUrl + "/api/user/update-course-progress",
                { courseId, lectureId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                getCourseProgress();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleRate = async (rating) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                backendUrl + "/api/user/add-rating",
                { courseId, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchUserEnrolledCourses();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getCourseProgress();
    }, []);

    const handleThumbnailClick = () => {
        if (!courseData) return;
        const firstChapter = courseData.courseContent[0];
        if (firstChapter && firstChapter.chapterContent.length > 0) {
            setPlayerData({
                ...firstChapter.chapterContent[0],
                chapter: 1,
                lecture: 1
            });
        }
    };

    useEffect(() => {
        if (playerData) {
            setIsLoadingVideo(true);
        }
    }, [playerData]);

    const youtubeOpts = {
        width: "100%",
        playerVars: {
            autoplay: 1,
            rel: 0,
        },
    };

    return courseData ? (
        <>
            <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
                {/* Left column */}
                <div className="text-gray-800">
                    <h2 className="text-xl font-semibold">Course Structure</h2>
                    <div className="pt-5">
                        {courseData.courseContent.map((chapter, index) => (
                            <div className="border border-gray-200 bg-white mb-2 rounded" key={index}>
                                <div
                                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                                    onClick={() => toggleSection(index)}
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
                                            src={assets.down_arrow_icon}
                                            alt=""
                                        />
                                        <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                                    </div>
                                    <p className="text-sm">
                                        {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                                    </p>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-[1000px]" : "max-h-0"}`}>
                                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t">
                                        {chapter.chapterContent.map((lecture, i) => (
                                            <li key={i} className="flex items-start gap-2 py-1">
                                                <img
                                                    onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                                                    className="w-4 h-4 mt-1 cursor-pointer"
                                                    src={progressData?.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
                                                    alt=""
                                                />
                                                <div className="flex items-center justify-between w-full text-xs md:text-sm">
                                                    <p>{lecture.lectureTitle}</p>
                                                    <div className="flex gap-2">
                                                        <p onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} className="text-blue-500 cursor-pointer">Watch</p>
                                                        <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 py-3 mt-10">
                        <h1 className="text-xl font-bold">Rate this Course:</h1>
                        <Rating initialRating={initialRating} onRate={handleRate} />
                    </div>
                </div>

                {/* Right column */}
                <div className="md:mt-10">
                    {playerData ? (
                        <div className="relative">
                            {isLoadingVideo && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
                                    <Loading />
                                </div>
                            )}
                            <YouTube
                                videoId={getYouTubeId(playerData.lectureUrl)}
                                iframeClassName="w-full aspect-video rounded"
                                opts={youtubeOpts}
                                onReady={() => setIsLoadingVideo(false)}
                                onStateChange={(e) => e.data === 1 ? setIsLoadingVideo(false) : null}
                            />
                            <div className="flex justify-between items-center mt-3">
                                <p className="font-medium">{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                                <button onClick={() => markLectureAsCompleted(playerData.lectureId)} className="text-blue-600">
                                    {progressData?.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark As Complete"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative cursor-pointer" onClick={handleThumbnailClick}>
                            <img src={courseData.courseThumbnail} alt="" className="w-full aspect-video rounded object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-blue-600/80 rounded-full flex items-center justify-center shadow-lg">
                                    <img src={assets.play_icon} className="w-8 h-8 invert" alt="" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Signature />
            <Footer />
        </>
    ) : (
        <Loading />
    );
};

export default Player;