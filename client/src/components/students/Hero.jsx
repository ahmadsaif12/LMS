import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from "./SearchBar"

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center pt-20 pb-14 px-7 md:px-20 lg:pt-32 bg-gradient-to-b from-cyan-50/50 to-white'> 
      
      <h1 className='text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 relative leading-[1.2] max-w-4xl'>
        Master the skills that <br className='hidden md:block' /> 
        <span className='text-blue-600'>shape your tomorrow.</span>
        <img 
          className='md:block hidden absolute -bottom-5 right-0 w-32 lg:w-48' 
          src={assets.sketch} 
          alt="decoration" 
        />
      </h1>

      <p className='mt-8 text-slate-600 text-base md:text-lg max-w-xl leading-relaxed'>
        Access a curated library of industry-leading courses designed by experts. 
        Start learning today and turn your curiosity into a career.
      </p>

      <p className='mt-4 text-sm font-medium text-slate-500 italic'>
        Join over 20,000+ students worldwide.
      </p>
      <br></br>
     <SearchBar/>
    </div>
    
  )
}

export default Hero;;