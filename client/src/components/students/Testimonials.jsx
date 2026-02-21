import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const Testimonials = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-semibold text-gray-800 text-center'>
        Testimonials
      </h2>
      <p className='text-gray-500 text-center mt-3 max-w-lg mx-auto'>
        Hear from our learners as they share their journeys of transformation and success.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14 max-w-6xl mx-auto'>
        {dummyTestimonial.map((testimonial, index) => (
          <div 
            key={index} 
            className='bg-white border border-gray-200 p-8 rounded-lg shadow-sm flex flex-col'
          >
            {/* User Info */}
            <div className='flex items-center gap-4 mb-4'>
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className='w-12 h-12 rounded-full' 
              />
              <div>
                <h3 className='text-lg font-medium text-gray-800'>{testimonial.name}</h3>
                <p className='text-gray-500 text-sm'>{testimonial.role}</p>
              </div>
            </div>

            {/* Stars */}
            <div className='flex gap-0.5 mb-3'>
              {[...Array(5)].map((_, i) => (
                <img 
                  key={i} 
                  src={i < testimonial.rating ? assets.star : assets.star_blank} 
                  alt="" 
                  className='w-3.5 h-3.5' 
                />
              ))}
            </div>
            
            <p className='text-gray-600 text-sm leading-relaxed mb-4'>
              {testimonial.feedback}
            </p>

            <div className='mt-auto'>
              <a 
                href="#" 
                className='text-blue-600 text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-all'
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials