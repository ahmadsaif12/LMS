import React, { useContext } from 'react'
import { assets } from "../../assets/assets"
import { Link } from "react-router-dom"
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/Appcontext';

const Navbar = () => {

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { navigate, isEducator } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 md:px-16 lg:px-32 py-3 
    bg-[#061e4d] border-b border-white/10 sticky top-0 z-50 shadow-xl">
      <Link to='/' className="flex-shrink-0 flex items-center group">
        <img 
          src={assets.logo} 
          alt="AE Icon" 
          className='h-10 sm:h-12 lg:h-14 w-auto object-contain cursor-pointer transition-transform group-hover:scale-105'
        />
        <span className='text-white font-bold text-xl sm:text-2xl tracking-tighter -ml-3 sm:-ml-4 select-none'>
          ahmad<span className='font-extrabold text-[#3b82f6] ml-0.5'>tech</span>
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center gap-6 lg:gap-10'>
        {user && (
          <div className='flex items-center gap-6 lg:gap-10 text-white font-semibold text-base lg:text-lg'>
            <button 
              onClick={() => navigate('/educator')}
              className='hover:text-blue-300 transition-colors'
            >
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>

            <Link 
              to='/my-enrollment'
              className='hover:text-blue-300 transition-colors'
            >
              My Enrollment
            </Link>
          </div>
        )}

        <div className='flex items-center ml-4'>
          {user ? (
            <UserButton afterSignOutUrl='/' />
          ) : (
            <button 
              onClick={() => openSignIn()} 
              className='bg-white text-[#061e4d] px-6 py-2 rounded-md text-base font-bold hover:bg-gray-100 transition-all active:scale-95'
            >
              Create Account
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className='md:hidden flex items-center gap-4 text-white'>
        {user ? (
          <UserButton afterSignOutUrl='/' />
        ) : (
          <button 
            onClick={() => openSignIn()}
            className='p-2 bg-white/10 rounded-full'
          >
            <img 
              src={assets.user_icon} 
              alt="usericon" 
              className="w-5 h-5 invert"
            />
          </button>
        )}
      </div>

    </div>
  )
}

export default Navbar