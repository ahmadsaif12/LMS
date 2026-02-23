import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/Appcontext'
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link 
      to={`/course/${course._id}`} 
      onClick={() => window.scrollTo(0, 0)}
      className='flex flex-col items-start text-left border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 pb-4 bg-white'
    >
      <img 
        className='w-full h-44 object-cover' 
        src={course.courseThumbnail} 
        alt={course.courseTitle} 
      />

      <div className='p-4 w-full'>
        <h3 className='text-base font-bold text-gray-900 leading-tight line-clamp-2 h-10'>
          {course.courseTitle}
        </h3>
        
        <p className='text-xs text-gray-500 mt-1'>Saif Ahmad</p>

        <div className='flex items-center gap-1.5 mt-2'>
          {/* Display average rating from context function */}
          <p className='text-sm font-bold text-yellow-700'>
            {calculateRating(course).toFixed(1)}
          </p>

          <div className='flex items-center gap-0.5'>
            {[...Array(5)].map((_, i) => (
              <img 
                key={i} 
                // Checks if current index is less than the floor of the rating
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} 
                alt="rating star" 
                className='w-3 h-3' 
              />
            ))}
          </div>
          
          <p className='text-xs text-gray-400'>
            ({course.courseRatings.length})
          </p>
        </div>

        <p className='text-lg font-extrabold text-gray-800 mt-3'>
          {currency}
          {(course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard