import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'

const Rating = () => {
  // State for the number of stars selected
  const [rating, setRating] = useState(0)
  // State for the hover effect (highlighting stars before clicking)
  const [hover, setHover] = useState(0)
  // State for the review text
  const [comment, setComment] = useState('')

  const handleRatingSubmit = (e) => {
    e.preventDefault()
    // Logic to send rating and comment to your backend would go here
    console.log({ rating, comment })
    alert("Thank you for your feedback!")
    // Reset form
    setRating(0)
    setComment('')
  }

  return (
    <div className='pb-10 pt-8'>
      <h3 className='text-xl font-bold text-gray-800'>Rate this Course</h3>
      <p className='text-gray-500 text-sm mt-1'>How was your experience with this course?</p>
      
      <form onSubmit={handleRatingSubmit} className='mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200'>
        {/* Star Selection Row */}
        <div className='flex items-center gap-1.5'>
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <img 
                key={index}
                // Toggle between filled star and blank star based on selection or hover
                src={ratingValue <= (hover || rating) ? assets.star : assets.star_blank}
                alt={`Star ${ratingValue}`}
                className='w-8 h-8 cursor-pointer transition-transform hover:scale-110'
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(ratingValue)}
              />
            );
          })}
          <span className='ml-3 text-sm font-medium text-gray-600'>
            {rating > 0 ? `${rating} / 5 Stars` : 'Select a rating'}
          </span>
        </div>

        
      </form>
    </div>
  )
}

export default Rating