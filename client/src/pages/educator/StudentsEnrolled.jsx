import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/Appcontext'
import { assets, dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/students/Loading'

const StudentsEnrolled = () => {

  const { navigate } = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  useEffect(() => {
    // Directly setting the data from your exported dummy array
    setEnrolledStudents(dummyStudentEnrolled)
  }, [])

  if (!enrolledStudents) return <Loading />

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <h1 className='pb-4 text-2xl font-semibold'>Students Enrolled</h1>

        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='md:table-auto table-fixed w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>#</th>
                <th className='px-4 py-3 font-semibold truncate'>Student Name</th>
                <th className='px-4 py-3 font-semibold truncate'>Course Title</th>
                <th className='px-4 py-3 font-semibold truncate'>Date</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-500'>
              {enrolledStudents.map((item, index) => (
                <tr key={index} className='border-b border-gray-500/20 hover:bg-gray-50/50 transition-colors'>
                  <td className='px-4 py-3'>{index + 1}</td>
                  
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                    {/* Displays GreatStack's Clerk profile image */}
                    <img 
                      src={item.student.imageUrl} 
                      alt="Student" 
                      className='w-9 h-9 rounded-full object-cover bg-gray-100' 
                      onError={(e) => e.target.src = assets.user_icon}
                    />
                    {/* Displays "GreatStack" or the student name */}
                    <span className='truncate font-medium text-gray-800'>
                      {item.student.name}
                    </span>
                  </td>

                  <td className='px-4 py-3 truncate text-gray-600'>
                    {item.courseTitle}
                  </td>

                  <td className='px-4 py-3 text-gray-500'>
                    {/* Formats the purchaseDate string into a readable date */}
                    {new Date(item.purchaseDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
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

export default StudentsEnrolled