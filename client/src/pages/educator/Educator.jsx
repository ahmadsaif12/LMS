import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/students/Footer'

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />

      <div className='flex'>
        <Sidebar />
        <div className='flex-1 h-screen overflow-y-auto bg-gray-50/50 p-5 md:p-10'>
          <Outlet />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Educator