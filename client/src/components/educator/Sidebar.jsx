import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className='md:w-64 w-16 flex flex-col bg-white min-h-screen border-r border-gray-200'>
      <div className='flex flex-col py-6'>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/educator'}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 transition-all duration-300
              ${isActive 
                ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className={`w-5 h-5 transition-all ${isActive ? 'brightness-100' : 'opacity-70 grayscale'}`} 
                />
                <span className='hidden md:block font-medium text-sm lg:text-base'>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar