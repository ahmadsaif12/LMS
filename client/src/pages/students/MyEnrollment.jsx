import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/Appcontext' 
import { Line } from 'rc-progress'
import Footer from '../../components/students/Footer'

const MyEnrollment = () => {
  const { enrolledCourses, fetchUserEnrolledCourses, calculateCourseDuration, navigate } = useContext(AppContext)

  // Fetch fresh data whenever this page loads to show the new "Completed" status
  useEffect(() => {
    fetchUserEnrolledCourses();
  }, []);

  return (
    <>
      <div className='md:px-36 px-8 pt-10 min-h-[80vh]'>
        <h1 className='text-2xl font-semibold text-gray-800'>My Enrollments</h1>
        
        <div className='mt-10 overflow-hidden rounded-lg border border-gray-200 shadow-sm mb-20'>
          <table className='w-full text-left bg-white table-fixed'>
            <thead className='bg-gray-50 border-b border-gray-200 text-gray-900 text-sm'>
              <tr>
                <th className='px-4 py-3 font-semibold w-1/3'>Course</th>
                <th className='px-4 py-3 font-semibold'>Duration</th>
                <th className='px-4 py-3 font-semibold'>Completed</th>
                <th className='px-4 py-3 font-semibold'>Status</th>
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              {enrolledCourses && enrolledCourses.length > 0 ? (
                enrolledCourses.map((course, index) => {
                  // Percentage logic (set to 0 if no progress data yet)
                  const percentage = 0; 

                  return (
                    <tr key={index} className='border-b border-gray-200 hover:bg-gray-50/50 transition-colors'>
                      <td className='px-4 py-3 flex items-center gap-3'>
                        <img src={course.courseThumbnail} alt="" className='w-14 md:w-24 rounded shadow-sm' />
                        <div className='flex-1'>
                          <p className='font-medium text-sm md:text-base line-clamp-1'>{course.courseTitle}</p>
                        </div>
                      </td>

                      <td className='px-4 py-3 text-sm'>
                        {calculateCourseDuration(course)} Min
                      </td>

                      <td className='px-4 py-3'>
                          <div className='flex flex-col w-24 md:w-40 gap-2'>
                              <p className='text-[10px] md:text-xs text-gray-500'>0 / 0 Lectures (0%)</p>
                              <Line percent={0} strokeWidth={3} strokeColor="#2563eb" trailWidth={3} />
                          </div>
                      </td>

                      <td className='px-4 py-3'>
                        <button 
                          onClick={() => navigate('/player/' + course._id)}
                          className='px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm rounded bg-blue-600 text-white hover:bg-blue-700'
                        >
                          On Going
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : null}
            </tbody>
          </table>
          {(!enrolledCourses || enrolledCourses.length === 0) && (
            <div className='p-10 text-center text-gray-500 bg-white'>
              No enrolled courses found.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyEnrollment;