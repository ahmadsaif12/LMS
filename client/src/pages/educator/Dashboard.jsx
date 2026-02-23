import React, { useContext, useEffect, useState } from 'react'
import { assets, dummyCourses, dummyStudentEnrolled } from '../../assets/assets'
import { AppContext } from '../../context/Appcontext'
import Loading from '../../components/students/Loading'

const Dashboard = () => {
  const { navigate, currency } = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchDashboardData = () => {
      try {
        // Calculating total earnings from dummy courses
        const totalEarnings = dummyCourses.reduce((acc, course) => 
          acc + (course.coursePrice - (course.discount * course.coursePrice / 100)), 0
        );
        
        // Using the exact data from dummyStudentEnrolled for the table
        setDashboardData({
          totalEnrolments: dummyStudentEnrolled.length,
          totalCourses: dummyCourses.length,
          totalEarnings: totalEarnings.toFixed(2),
          enrolledStudentsData: dummyStudentEnrolled.slice(0, 5) 
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }

    fetchDashboardData()
  }, [])

  if (!dashboardData) return <Loading />

  return (
    <div className='p-6 bg-[#f8f9fa] min-h-screen'>
      
      {/* --- STATS SECTION --- */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10'>
        <div className='flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm'>
          <img src={assets.patients_icon} alt="enrolments" className='w-12 h-12' />
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashboardData.totalEnrolments}</p>
            <p className='text-gray-500 text-sm'>Total Enrolments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm'>
          <img src={assets.appointments_icon} alt="appointments" className='w-12 h-12' />
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashboardData.totalCourses}</p>
            <p className='text-gray-500 text-sm'>Total Courses</p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm'>
          <img src={assets.earning_icon} alt="earnings" className='w-12 h-12' />
          <div>
            <p className='text-2xl font-bold text-gray-800'>
              {currency}{dashboardData.totalEarnings}
            </p>
            <p className='text-gray-500 text-sm'>Total Earnings</p>
          </div>
        </div>
      </div>

      {/* --- RECENT ENROLMENTS TABLE --- */}
      <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30'>
          <h2 className='text-lg font-bold text-gray-800'>Recent Enrolments</h2>
          <button 
            onClick={() => navigate('/educator/students-enrolled')}
            className='text-blue-600 text-sm font-medium hover:underline'
          >
            View All
          </button>
        </div>
        
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-gray-50/50 text-gray-600 uppercase text-xs font-semibold'>
              <tr>
                <th className='px-6 py-4'>#</th>
                <th className='px-6 py-4'>Student Name</th>
                <th className='px-6 py-4'>Course Title</th>
                <th className='px-6 py-4'>Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className='hover:bg-blue-50/10 transition-colors'>
                  <td className='px-6 py-4 text-sm text-gray-500'>{index + 1}</td>
                  <td className='px-6 py-4 text-sm font-medium text-gray-800 flex items-center gap-3'>
                    <img 
                      src={item.student.imageUrl} 
                      alt="profile" 
                      className='w-9 h-9 rounded-full object-cover'
                      onError={(e) => e.target.src = assets.user_icon}
                    />
                    <span>{item.student.name}</span>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600'>{item.courseTitle}</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard