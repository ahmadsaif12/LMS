import React, { useContext } from 'react'
import { assets } from "../../assets/assets"
import { Link } from "react-router-dom"
import { UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/Appcontext';

const Navbar = () => {
  const { user } = useUser();
  const {navigate}=useContext(AppContext);

  // Debugging: Check if assets are loading
  if (!assets.logo) {
    console.warn("Logo path is missing in assets.js");
  }

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-12 py-3 
    bg-[#061e4d] border-b border-white/10 sticky top-0 z-[100] shadow-xl">
      
      {/* LEFT SIDE: Logo & Label */}
      <Link to='/educator' className="flex items-center gap-3 group">
        <div className='bg-white/10 p-1.5 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all'>
          {assets.logo ? (
            <img 
              src={assets.logo} 
              alt="Logo" 
              className='h-8 sm:h-9 w-auto object-contain'
            />
          ) : (
            <div className='h-8 w-8 bg-blue-500 rounded'></div> 
          )}
        </div>
        
        <div className='flex items-center'>
          <span className='text-white font-bold text-lg sm:text-xl tracking-tighter ml-1 select-none'>
            ahmad<span className='font-extrabold text-[#3b82f6] ml-0.5'>tech</span>
          </span>
          
          <div className='hidden md:block w-[1px] h-5 bg-white/20 mx-4'></div>
          
          <span className='hidden sm:block text-blue-200 text-[10px] md:text-xs font-bold tracking-widest uppercase bg-white/5 px-2 py-1 rounded border border-white/10'>
            Educator Panel
          </span>
        </div>
      </Link>

      {/* RIGHT SIDE: User profile */}
      <div className='flex items-center gap-4 md:gap-6'>
        <p className='hidden md:block text-gray-300 text-sm font-medium'>
          Welcome, <span className='text-[#3b82f6]'>{user?.firstName || 'Educator'}</span>
        </p>
        
        {/* Clerk Profile Icon */}
        <div className='flex items-center justify-center p-0.5 bg-white/10 rounded-full hover:bg-white/20 transition-all'>
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
      
    </nav>
  )
}

export default Navbar