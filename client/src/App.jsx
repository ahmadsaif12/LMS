import React from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import Home from "./pages/students/Home.jsx"
import CoursesList from "./pages/students/CoursesList.jsx"
import CourseDetails from "./pages/students/CourseDetails.jsx"
import MyEnrollment from "./pages/students/MyEnrollment.jsx"
import Player from "./pages/students/Player.jsx"
import Loading from "./components/students/Loading.jsx"
import Navbar from './components/students/Navbar.jsx'
import Educator from "./pages/educator/Educator.jsx"
import Dashboard from "./pages/educator/Dashboard.jsx"
import AddCourse from "./pages/educator/Addcourse.jsx" 
import MyCourses from "./pages/educator/MyCourses.jsx"
import StudentsEnrolled from "./pages/educator/StudentsEnrolled.jsx"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer />
      {!isEducatorRoute && <Navbar />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollment />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App