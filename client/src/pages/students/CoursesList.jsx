import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/Appcontext'
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/students/CourseCard';
import SearchBar from '../../components/students/SearchBar'; 
import { assets } from '../../assets/assets';
import Footer from '../../components/students/Footer';

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      if (input) {
        setFilteredCourses(allCourses.filter(
          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
        ));
      } else {
        setFilteredCourses(allCourses);
      }
    }
  }, [allCourses, input]);

  return (
    <>
      {/* Main Content Container with Padding */}
      <div className='relative md:px-36 px-8 pt-20 text-left min-h-screen'>
        <div className='flex flex-col md:flex-row gap-6 justify-between items-start w-full'>
          <div>
            <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span 
                className='text-blue-600 cursor-pointer hover:underline' 
                onClick={() => navigate('/')}
              >Home</span>
              <span> / Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>

        {/* Active Search Filter Tag */}
        { input && (
          <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600 bg-gray-50 rounded-sm'>
            <p>{input}</p>
            <img 
              src={assets.cross_icon} 
              alt="Clear Search" 
              className='cursor-pointer w-3' 
              onClick={() => navigate("/course-list")} 
            />
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-16 px-4 md:px-0'>
          {filteredCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CoursesList