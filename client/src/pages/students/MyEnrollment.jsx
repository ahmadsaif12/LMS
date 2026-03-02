import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/Appcontext' // Ensure casing matches your file (AppContext or Appcontext)
import { Line } from 'rc-progress'
import Footer from '../../components/students/Footer'

const MyEnrollment = () => {
  // 1. Changed to enrolledCourses to match the Context state
  const { enrolledCourses, calculateCourseDuration, navigate } = useContext(AppContext)

  const [progressArray, setProgressArray] = useState([
    { completedLectures: 4, totalLectures: 10 },
    { completedLectures: 12, totalLectures: 12 },
    { completedLectures: 1, totalLectures: 5 },
  ])

  return (
    <>
      <div className='md:px-36 px-8 pt-10 min-h-[80vh]'>
        <h1 className='text-2xl font-semibold text-gray-800'>My Enrollments</h1>
        
        <div className='mt-10 overflow-hidden rounded-lg border border-gray-200 shadow-sm mb-20'>
          <table className='w-full text-left bg-white table-fixed'>
            <thead className='bg-gray-50 border-b border-gray-200 text-gray-900 text-sm'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate w-1/3'>Course</th>
                <th className='px-4 py-3 font-semibold truncate'>Duration</th>
                <th className='px-4 py-3 font-semibold truncate'>Completed</th>
                <th className='px-4 py-3 font-semibold truncate'>Status</th>
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              {/* 2. Added optional chaining ?. to prevent crash if data isn't loaded yet */}
              {enrolledCourses?.map((course, index) => {
                const completed = progressArray[index]?.completedLectures || 0;
                const total = progressArray[index]?.totalLectures || 1;
                const percentage = Math.round((completed / total) * 100);

                return (
                  <tr key={index} className='border-b border-gray-200 last:border-0 hover:bg-gray-50/50 transition-colors'>
                    <td className='px-4 py-3 flex items-center gap-3'>
                      <img src={course.courseThumbnail} alt="" className='w-14 md:w-24 rounded shadow-sm' />
                      <div className='flex-1'>
                        <p className='font-medium text-sm md:text-base line-clamp-1 text-gray-800'>{course.courseTitle}</p>
                      </div>
                    </td>

                    <td className='px-4 py-3 text-sm'>
                      {calculateCourseDuration(course)} Min
                    </td>

                    <td className='px-4 py-3'>
                        <div className='flex flex-col w-24 md:w-40 gap-2'>
                            <p className='text-[10px] md:text-xs text-gray-500 font-medium'>
                                {completed} / {total} Lectures ({percentage}%)
                            </p>
                            <Line 
                              percent={percentage} 
                              strokeWidth={3} 
                              strokeColor={percentage === 100 ? "#22c55e" : "#2563eb"} 
                              trailWidth={3} 
                              trailColor="#e5e7eb" 
                              strokeLinecap="round"
                            />
                        </div>
                    </td>

                    <td className='px-4 py-3'>
                      <button 
                        onClick={() => navigate('/player/' + course._id)}
                        className={`px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm rounded transition-all active:scale-95 ${
                          percentage === 100 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {percentage === 100 ? 'Completed' : 'On Going'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* 3. Empty State UI */}
          {enrolledCourses?.length === 0 && (
            <div className='p-10 text-center text-gray-500'>
              You aren't enrolled in any courses yet.
            </div>
          )}
        </div>
      </div>
     
      <Footer />
    </>
  )
}

export default MyEnrollment