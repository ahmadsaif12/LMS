import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  // Use data if it exists, otherwise default to empty string
  const [input, setInput] = useState(data ? data : '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    // Only navigate if there is input to search for
    if (input.trim()) {
      navigate("/course-list/" + input);
    }
  };

  return (
    <form 
      onSubmit={onSearchHandler} 
      className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-300/70 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden mx-auto'
    >
      <img 
        src={assets.search_icon} 
        alt="search" 
        className='md:w-auto w-5 px-4 opacity-50' 
      />
      
      <input 
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text" 
        placeholder='Search for Courses' 
        className='w-full h-full outline-none text-gray-600 text-sm md:text-base placeholder:text-gray-400'
      />
      
      <button 
        type='submit' 
        className='bg-blue-600 hover:bg-blue-700 text-white px-7 md:px-10 py-2 md:py-3 rounded-full m-1 text-sm md:text-base font-medium transition-colors'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar