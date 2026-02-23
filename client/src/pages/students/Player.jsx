import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'
import { assets } from '../../assets/assets'
import Loading from '../../components/students/Loading'
import Footer from '../../components/students/Footer'
import Rating from '../../components/students/Rating' 

const Player = () => {
  const { courseId } = useParams()
  const { allCourses, calculateChapterTime } = useContext(AppContext)
  
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|m.youtube.com\/watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0`;
    }
    return url;
  };

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const findCourse = allCourses.find(item => item._id === courseId)
      if (findCourse) {
        setCourseData(findCourse)
        if (findCourse.courseContent?.length > 0 && findCourse.courseContent[0].chapterContent?.length > 0) {
           setPlayerData(findCourse.courseContent[0].chapterContent[0])
           setOpenSections({ 0: true })
        }
      }
    }
  }, [allCourses, courseId])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  if (!courseData) return <Loading />

  return (
    <>
      <div className='p-4 md:px-36 flex flex-col md:flex-row gap-10 pt-10 min-h-screen'>
        
        {/* --- LEFT COLUMN: Course Structure --- */}
        <div className='md:w-1/3 w-full'>
          <h2 className='text-xl font-semibold text-gray-800'>Course Structure</h2>
          <div className='pt-5'>
            {courseData.courseContent?.map((chapter, index) => (
              <div key={index} className='border border-gray-300 bg-white mb-2 rounded overflow-hidden shadow-sm'>
                <div 
                  className='flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-gray-50/50 hover:bg-gray-100 transition-colors'
                  onClick={() => toggleSection(index)}
                >
                  <div className='flex items-center gap-2'>
                    <img 
                      className={`w-3 transition-transform duration-300 ${openSections[index] ? 'rotate-180' : ''}`} 
                      src={assets.down_arrow_icon} alt="" 
                    />
                    <p className='font-semibold text-gray-800 text-sm md:text-base'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-xs text-gray-500'>
                    {chapter.chapterContent?.length} lectures - {calculateChapterTime(chapter)} min
                  </p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-[1000px]' : 'max-h-0'}`}>
                  <ul className='list-none px-4 py-2 border-t border-gray-200 text-gray-600'>
                    {chapter.chapterContent?.map((lecture, i) => (
                      <li 
                        key={i} 
                        className={`flex items-start gap-3 py-3 border-b last:border-0 border-gray-100 cursor-pointer hover:bg-blue-50/30 transition-all ${playerData?.lectureTitle === lecture.lectureTitle ? 'bg-blue-50' : ''}`}
                        onClick={() => setPlayerData(lecture)}
                      >
                        <img src={assets.play_icon} alt="play" className='w-4 mt-0.5 opacity-80' />
                        <div className='flex items-center justify-between w-full text-sm'>
                          <p className={`font-medium ${playerData?.lectureTitle === lecture.lectureTitle ? 'text-blue-600' : 'text-gray-700'}`}>
                            {lecture.lectureTitle}
                          </p>
                          <p className='text-gray-400'>{lecture.lectureDuration} min</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Player & Rating Component --- */}
        <div className='md:w-2/3 w-full'>
          {playerData ? (
            <div className='flex flex-col'>
              <div className='aspect-video bg-black rounded-lg overflow-hidden shadow-lg'>
                <iframe 
                  width="100%" height="100%" 
                  src={getYouTubeEmbedUrl(playerData.lectureUrl)} 
                  title="Lecture Video" frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className='mt-6 border-b pb-8'>
                <h1 className='text-2xl font-bold text-gray-800'>{playerData.lectureTitle}</h1>
                <p className='text-gray-500 mt-2'>Viewing: {courseData.courseTitle}</p>
              </div>
              <Rating />

              {/* Course Description */}
              <div className='mt-12 mb-10'>
                <h3 className='text-lg font-semibold text-gray-800'>About this Course</h3>
                <div 
                  className='text-gray-600 mt-4 leading-relaxed'
                  dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
                ></div>
              </div>
            </div>
          ) : (
            <div className='aspect-video bg-gray-50 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200'>
              <p className='text-gray-400'>Select a lecture to start learning.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Player