
<div align="center">
  
![favicon](https://github.com/user-attachments/assets/ba86af86-a98e-4842-9cc4-5871c5ef234b)

</div>

# Edemy LMS 🎓 - A Modern Learning Management System


Edemy LMS is a full-stack learning management system (LMS) that provides educators and students with a seamless e-learning experience. Built using modern web technologies, it includes user authentication, course management, video streaming, and progress tracking.
<img width="1536" height="1024" alt="edemylms" src="https://github.com/user-attachments/assets/dab1ef86-1699-488f-addb-c7315b1116ed" />

![Edemy LMS](https://github.com/user-attachments/assets/8926c6a8-0e32-442a-82f5-dd19b11b6d7c)



## 🚀 Tech Stack

### Frontend:
- **React** (via Vite) ⚡
- **React Router DOM** for navigation
- **React Toastify** for notifications
- **Framer Motion** for animations
- **Quill** for rich text editing
- **Axios** for API requests
- **RC Progress** for progress tracking
- **React YouTube** for video embedding
- **Clerk Authentication** for user management

### Backend:
- **Node.js** & **Express.js** 🚀
- **MongoDB** & **Mongoose** for database
- **Cloudinary** for media storage
- **Multer** for file uploads
- **Stripe** for payment processing
- **Cors** for cross-origin requests
- **Dotenv** for environment variables
- **Nodemon** for development

---

## 📂 Project Structure

### **Frontend (`client/`)**
```
📦 client
 ├── 📂 src
 │   ├── 📂 assets
 │   ├── 📂 components
 │   │   ├── 📂 educator
 │   │   │   ├── Footer.jsx
 │   │   │   ├── Navbar.jsx
 │   │   │   ├── Sidebar.jsx
 │   │   ├── 📂 student
 │   │   │   ├── Logger.jsx
 │   ├── 📂 context
 │   │   ├── AppContext.jsx
 │   ├── 📂 pages
 │   │   ├── 📂 educator
 │   │   │   ├── AddCourse.jsx
 │   │   │   ├── Dashboard.jsx
 │   │   │   ├── Educator.jsx
 │   │   │   ├── MyCourses.jsx
 │   │   │   ├── StudentsEnrolled.jsx
 │   │   ├── 📂 student
 │   │   │   ├── CourseDetails.jsx
 │   │   │   ├── CoursesList.jsx
 │   │   │   ├── Home.jsx
 │   │   │   ├── MyEnrollMents.jsx
 │   │   │   ├── Player.jsx
 │   │   ├── App.jsx
 │   │   ├── index.css
 │   │   ├── main.jsx
 ├── 📜 .env
 ├── 📜 .gitignore
 ├── 📜 package.json
 ├── 📜 tailwind.config.js
 ├── 📜 vite.config.js

```

### **Backend (`server/`)**
```
📦 server
 ├── 📂 configs
 │   ├── cloudinary.js
 │   ├── mongodb.js
 │   ├── multer.js
 ├── 📂 controllers
 │   ├── courseController.js
 │   ├── educatorController.js
 │   ├── userController.js
 │   ├── webhooks.js
 ├── 📂 middlewares
 │   ├── authMiddleware.js
 ├── 📂 models
 │   ├── Course.js
 │   ├── CourseProgress.js
 │   ├── Purchase.js
 │   ├── User.js
 ├── 📂 routes
 │   ├── courseRoute.js
 │   ├── educatorRoutes.js
 │   ├── userRoutes.js
 ├── 📜 .env
 ├── 📜 .gitignore
 ├── 📜 package.json
 ├── 📜 server.js
 ├── 📜 vercel.json
```

---

## 🌟 Features

✅ **User Authentication** (Signup, Login, Clerk Integration)  
✅ **Course Management** (Add, Edit, Delete, Enroll)  
✅ **Video Streaming** (Embedded YouTube player)  
✅ **Progress Tracking** (Course Completion)  
✅ **Educator Dashboard** (Monitor students)  
✅ **Secure Payments** (Stripe integration)  
✅ **Responsive Design** (Mobile-friendly UI)  

---

## 📸 Screenshots

| Page | Screenshot |
|------|-----------|
| **Home Page** | ![Home](https://github.com/user-attachments/assets/03cf6bd7-8c30-4817-ad49-4a8fe8000541) |
| **Course Page** | ![Course](https://github.com/user-attachments/assets/e42c2660-8271-42ae-b7e3-c5278b6a9cf1) |
| **My Enrollments** | ![Enrollments](https://github.com/user-attachments/assets/a88cf7c1-cab1-4106-a64d-d7cfd5d9d4b7) |
|






## ⚡ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Gyanthakur/Edemy-LMS.git
cd edemy-lms
```

### 2️⃣ Install Dependencies

#### Frontend:
```bash
cd client
npm install
npm run dev
```

#### Backend:
```bash
cd server
npm install
npm start
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in both `client/` and `server/` directories and add required credentials (MongoDB, Cloudinary, Clerk, Stripe, etc.).

---

## 🔥 Deployment

This project is set up for deployment on **Vercel**.

### Deploy Backend
```bash
cd server
vercel --prod
```

### Deploy Frontend
```bash
cd client
vercel --prod
```

---

## 🔐 License
This project is licensed under the [MIT License](LICENSE).

---
## 🎯 Contributors

👤 **Saif Ahmad** – *Developer & Maintainer*  
📧 Contact: [your-email@example.com](mailto:your-email@example.com)  
🔗 GitHub: [@ahmadsaif12](https://github.com/ahmadsaif12)  


## 🤝 Connect With Me
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=38BDF8&center=true&vCenter=true&width=600&lines=Hey+there!+I'm+Saif+Ahmad;Full+Stack+Web+Developer;Open+Source+Contributor;Always+Open+to+Collaborations;Let's+Build+Something+Awesome&v=2" alt="Typing" />
</p>

<p align="center">
  <a href="https://github.com/ahmadsaif12">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

---

## Thank you for checking out the **Edemy LMS** project! Happy coding! 😊

---
## ⭐ Support
Give a ⭐ if you like this project!

---
Made with ❤️ by **Saif Ahmad**

### ⭐ Show Some Love!

If you like this project, don't forget to leave a **⭐ Star** on GitHub! 🚀

<img width="1536" height="1024" alt="gps" src="https://github.com/user-attachments/assets/fde20654-9d28-44b1-93e7-167e112752a0" />