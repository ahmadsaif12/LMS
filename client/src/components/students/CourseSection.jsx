import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'
import CourseCard from './CourseCard' 

const CourseSection = () => {

  const { allCourses } = useContext(AppContext);

  return (
    <div className='py-16 md:px-40 px-8 text-center'>
      <h2 className='text-3xl md:text-4xl font-semibold text-gray-800'>
        Learn from the <span className='text-blue-600'>best instructors</span>
      </h2>
      
      <p className='text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base'>
        Explore our top-rated courses across various categories. From coding and design 
        to business and wellness, find the perfect path to advance your career.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-16 px-4 md:px-0'>
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <Link 
        to="/course-list" 
        onClick={() => window.scrollTo(0, 0)}
        className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded-md hover:bg-gray-50 transition-all duration-300'
      >
        Show all courses
      </Link>
    </div>
  )
}

export default CourseSection