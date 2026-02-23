import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between px-8 md:px-12 py-4 border-t border-gray-200 bg-white text-gray-500 text-sm">
      
      {/* LEFT SIDE: Copyright & Logo */}
      <div className="flex items-center gap-4">
        <img src={assets.logo} alt="logo" className="w-20 hidden md:block opacity-80" />
        <div className='hidden md:block w-[1px] h-4 bg-gray-300'></div>
        <p>© {new Date().getFullYear()} ahmadtech. All rights reserved.</p>
      </div>

      {/* RIGHT SIDE: Links & Socials */}
      <div className="flex items-center gap-6 mt-4 md:mt-0">
        <a href="/" className="hover:text-blue-600 transition-colors">Go to Student Site</a>
        <div className="flex items-center gap-3">
          <a href="#"><img src={assets.facebook_icon} alt="facebook" className="w-5 grayscale hover:grayscale-0 transition-all" /></a>
          <a href="#"><img src={assets.twitter_icon} alt="twitter" className="w-5 grayscale hover:grayscale-0 transition-all" /></a>
          <a href="#"><img src={assets.instagram_icon} alt="instagram" className="w-5 grayscale hover:grayscale-0 transition-all" /></a>
        </div>
      </div>

    </footer>
  )
}

export default Footer