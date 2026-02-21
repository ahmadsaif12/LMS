import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'
import Loading from '../../components/students/Loading' 
import Footer from '../../components/students/Footer'

const CourseDetails = () => {
  const { id } = useParams()
  const { allCourses, currency } = useContext(AppContext)
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCourseData = async () => {
    // Find the specific course from allCourses based on the ID from URL
    const findCourse = allCourses.find(course => course._id === id)
    if (findCourse) {
      setCourseData(findCourse)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (allCourses.length > 0) {
      fetchCourseData()
    }
  }, [allCourses, id])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='flex flex-col md:flex-row gap-10 relative items-start justify-between md:px-36 px-8 pt-20 pb-32'>
        
        {/* Left Column: Course Info */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-4xl text-2xl font-semibold text-gray-800'>
            {courseData.courseTitle}
          </h1>
          
          {/* We use dangerouslySetInnerHTML in case the description contains HTML tags from an editor */}
          <div 
            className='pt-4 text-sm md:text-base'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}
          ></div>
          
          <div className='mt-8'>
            <button className='bg-blue-600 text-white px-10 py-3 rounded-md font-medium'>
              Enroll Now
            </button>
          </div>
        </div>

        {/* Right Column: Course Image/Thumbnail */}
        <div className='max-w-[424px] z-10 shadow-lg rounded-t-md overflow-hidden bg-white'>
          <img 
            src={courseData.courseThumbnail} 
            alt={courseData.courseTitle} 
            className='w-full'
          />
          <div className='p-5'>
             <p className='text-2xl font-medium text-gray-800'>
                {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)}
             </p>
             <p className='text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}

export default CourseDetails