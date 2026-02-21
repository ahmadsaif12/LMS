import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-[#061e4d] text-white/80 py-12 w-full border-t border-white/10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-40 justify-between gap-10 md:gap-32'>
        
        <div className='flex flex-col md:items-start items-center w-full'>
          <div className='flex items-center mb-6'>
            <img 
              src={assets.logo_dark} 
              alt="AE Icon" 
              className='h-10 w-auto object-contain mix-blend-screen' 
            />
            <span className='text-gray-200 font-bold text-xl tracking-tighter -ml-2'>
              ahmad<span className='font-extrabold text-blue-400'>tech</span>
            </span>
          </div>
          <p className='text-sm leading-relaxed text-gray-400 text-center md:text-left'>
            ahmadtech is a premier learning platform dedicated to bridging the gap between 
            education and industry through project-based learning.
          </p>
        </div>

        {/* Company Links */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h3 className='text-white font-semibold text-lg mb-6'>Company</h3>
          <ul className='flex flex-col gap-3 text-sm text-gray-400'>
            <li className='hover:text-white transition-colors cursor-pointer'>Home</li>
            <li className='hover:text-white transition-colors cursor-pointer'>About us</li>
            <li className='hover:text-white transition-colors cursor-pointer'>Contact us</li>
            <li className='hover:text-white transition-colors cursor-pointer'>Privacy policy</li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h3 className='text-white font-semibold text-lg mb-6 text-center md:text-left'>
            Subscribe to our newsletter
          </h3>
          <p className='text-sm text-gray-400 mb-4 text-center md:text-left'>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className='flex w-full max-w-md'>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className='bg-gray-800 text-white border border-gray-700 rounded-l-md px-4 py-2 w-full outline-none focus:border-blue-500' 
            />
            <button className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-r-md transition-all font-bold'>
              Join
            </button>
          </div>
        </div>
      </div>

      <div className='mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500'>
        Copyright 2026 © ahmadtech. All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer;