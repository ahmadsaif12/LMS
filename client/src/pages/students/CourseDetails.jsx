import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'
import Loading from '../../components/students/Loading' 
import Footer from '../../components/students/Footer'
import { assets } from '../../assets/assets'

const CourseDetails = () => {
  const { id } = useParams()
  
  const { 
    allCourses, 
    currency, 
    calculateRating, 
    calculateNoOfLectures, 
    calculateCourseDuration,
    calculateChapterTime 
  } = useContext(AppContext)

  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)

  // Robust URL Parser to fix Playback Errors
  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    // Adding origin helps prevent "Playback ID" errors in some environments
    const origin = window.location.origin;
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&origin=${origin}` : url;
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  useEffect(() => {
    const fetchCourseData = () => {
      const findCourse = allCourses.find(item => item._id === id)
      if (findCourse) {
        setCourseData(findCourse)
        setLoading(false)
      }
    }

    if (allCourses && allCourses.length > 0) {
      fetchCourseData()
    }
  }, [allCourses, id])

  if (loading || !courseData) {
    return <Loading />
  }

  const avgRating = calculateRating(courseData);

  return (
    <>
      {/* --- VIDEO PLAYER MODAL --- */}
      {playerData && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
          <div className='relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl'>
            <button 
              onClick={() => setPlayerData(null)}
              className='absolute top-4 right-4 text-white bg-black/50 hover:bg-black rounded-full p-2 z-[110] transition-colors'
            >
              <img src={assets.cross_icon} alt="close" className='w-4' />
            </button>
            
            <div className='aspect-video bg-black'>
              <iframe 
                width="100%" 
                height="100%" 
                src={playerData.lectureUrl} 
                title="Course Preview" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            
            <div className='p-5 bg-white'>
               <h2 className='text-xl font-semibold text-gray-800'>{playerData.lectureTitle}</h2>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col md:flex-row gap-10 relative items-start justify-between md:px-36 px-8 pt-20 pb-32'>
        
        <div className='absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-cyan-100/70'></div>

        {/* Left Column: Course Info */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-4xl text-2xl font-semibold text-gray-800'>
            {courseData.courseTitle}
          </h1>
          
          <div 
            className='pt-4 text-sm md:text-base'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}
          ></div>
          
          <div className='flex items-center gap-1.5 mt-2'>
            <p className='text-sm font-bold text-yellow-700'>{avgRating.toFixed(1)}</p>
            <div className='flex items-center gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <img 
                  key={i} 
                  src={i < Math.floor(avgRating) ? assets.star : assets.star_blank} 
                  alt="" 
                  className='w-3.5 h-3.5' 
                />
              ))}
            </div>
            <p className='text-xs text-blue-600 ml-1'>
              ({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})
            </p>
            <p className='ml-4 text-sm text-gray-500'>
              {courseData.enrolledStudents.length} {courseData.enrolledStudents.length === 1 ? 'student' : 'students'}
            </p>
          </div>

          <p className='mt-4 text-sm text-gray-800'>Course by <span className='font-medium text-blue-600 underline cursor-pointer'>Saif Ahmad</span></p>

          {/* Course Structure */}
          <div className='pt-12'>
            <h2 className='text-2xl font-semibold text-gray-800'>Course Structure</h2>
            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded overflow-hidden shadow-sm'>
                  <div 
                    className='flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-gray-50/50 hover:bg-gray-50 transition-colors'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-2'>
                      <img 
                        className={`w-3 transition-transform duration-300 ${openSections[index] ? 'rotate-180' : ''}`} 
                        src={assets.down_arrow_icon} 
                        alt="arrow" 
                      />
                      <p className='font-semibold text-gray-800 text-sm md:text-base'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-xs md:text-sm text-gray-500'>
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)} min
                    </p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <ul className='list-none px-4 py-2 border-t border-gray-200 text-gray-600'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='flex items-start gap-3 py-3 border-b last:border-0 border-gray-100'>
                          <img src={assets.play_icon} alt="play" className='w-4 mt-0.5 opacity-80' />
                          <div className='flex items-center justify-between w-full text-sm'>
                            <p className='text-gray-700 font-medium'>{lecture.lectureTitle}</p>
                            <div className='flex gap-3 items-center'>
                              {lecture.isPreviewFree && (
                                <p 
                                  onClick={() => setPlayerData({
                                    lectureUrl: getEmbedUrl(lecture.lectureUrl),
                                    lectureTitle: lecture.lectureTitle
                                  })}
                                  className='text-blue-600 font-semibold cursor-pointer hover:underline'
                                >
                                  Preview
                                </p>
                              )}
                              <p className='text-gray-400 font-light'>{lecture.lectureDuration} min</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='py-12'>
             <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
             <div 
                className='pt-4 text-gray-500 rich-text leading-relaxed' 
                dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
             ></div>
          </div>
        </div>

        {/* Right Column: Pricing Card */}
        <div className='w-full md:max-w-[380px] shadow-xl rounded-lg overflow-hidden bg-white z-20 border border-gray-100 sticky top-24'>
          <img src={courseData.courseThumbnail} alt={courseData.courseTitle} className='w-full object-cover' />
          
          <div className='p-6'>
             <div className='flex items-center gap-3'>
                <p className='text-3xl font-bold text-gray-900'>
                  {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)}
                </p>
                <div className='flex flex-col'>
                    <p className='text-gray-400 line-through text-sm'>{currency}{courseData.coursePrice}</p>
                    <p className='text-xs text-orange-600 font-bold'>{courseData.discount}% Off</p>
                </div>
             </div>

             <div className='flex items-center gap-5 mt-4 text-gray-700 border-b border-gray-100 pb-4'>
                <div className='flex items-center gap-1.5'>
                    <img src={assets.time_clock_icon} alt="time" className='w-4' />
                    <p className='text-sm font-medium'>{calculateCourseDuration(courseData)} Min</p>
                </div>
                <div className='flex items-center gap-1.5'>
                    <img src={assets.lesson_icon} alt="lessons" className='w-4' />
                    <p className='text-sm font-medium'>{calculateNoOfLectures(courseData)} Lectures</p>
                </div>
             </div>
             
             <button className='w-full bg-blue-600 text-white py-3 rounded-md mt-6 font-semibold hover:bg-blue-700 transition-all'>
                Enroll Now
             </button>

             <div className='mt-8'>
                <p className='font-bold text-gray-800 uppercase text-xs tracking-wider mb-3'>
                    Who is this course for?
                </p>
                <ul className='space-y-2 list-disc list-inside text-sm text-gray-600'>
                    <li>Beginners who want to master {courseData.courseTitle}</li>
                    <li>Students looking for project-based learning</li>
                    <li>Anyone interested in learning from Saif Ahmad</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CourseDetails