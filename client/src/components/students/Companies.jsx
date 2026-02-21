import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='py-10'> 
      <p className='text-sm md:text-base text-gray-600 py-8 font-medium uppercase tracking-wider'>
        Trusted by learners from
      </p>
      
      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-14 mt-6 '>
        <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28 object-contain hover:opacity-100 transition-opacity' />
        <img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28  object-contain  hover:opacity-100 transition-opacity' />
        <img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28   object-contain hover:opacity-100 transition-opacity' />
        <img src={assets.paypal_logo} alt="PayPal" className='w-20 md:w-28 object-contain hover:opacity-100 transition-opacity' />
      </div>
    </div>
  )
}

export default Companies;