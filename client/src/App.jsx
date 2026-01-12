import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from "./pages/students/Home.jsx"
import CoursesList from "./pages/students/CoursesList.jsx"
import CourseDetails from "./pages/students/CourseDetails.jsx"
import MyEnrollment from "./pages/students/MyEnrollment.jsx"
import Player from "./pages/students/Player.jsx"
import Loading from "./components/students/Loading.jsx"
import Educator from "./pages/educator/Educator.jsx"
import Studentsenrolled from './pages/educator/StudentsEnrolled.jsx'
import AddCourse from './pages/educator/Addcourse.jsx'
import MyCourses from "./pages/educator/MyCourses.jsx"
import Dashboard from './pages/educator/Dashboard.jsx'

const App = () => {
  return (
    <div>
      <Routes>
         <Route path="/" element={<Home />}/>
         <Route path="/course-list" element={<CoursesList />} />
         <Route path="/course-list/:input" element={<CoursesList />} />
         <Route path="/course/:id" element={<CourseDetails />} />
         <Route path="/my-enrollments" element={<MyEnrollment />} />
         <Route path="/player/:courseId" element={<Player />} />
         <Route path="/loading/:path" element={<Loading />} />
         <Route path="/educator" element={<Educator />}>
             <Route  path="/educator" element={<Dashboard />}/>
             <Route  path="add-course" element={<AddCourse />}/>
             <Route  path="my-course" element={<MyCourses />}/>
             <Route  path="students-enrolled" element={<Studentsenrolled />}/>
         </Route>
         
      </Routes>
    </div>
  )
}

export default App
