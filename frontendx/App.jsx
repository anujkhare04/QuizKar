import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { adduser } from './src/feature/auth.slice';

import Home from "./src/pages/home";
import CreateQuiz from "./src/pages/creatquiz";
import Login from "./src/pages/login";
import MockTest from "./src/pages/MockTest"; // Import MockTest
// import Quizchoose from "./pages/quizchose";
// import Testsetup from "./pages/testsetup";
import { Route, Routes } from "react-router-dom";
import QuizParent from "./src/pages/quizparents";
import Testwindow from "./src/pages/testwindow"
import Profile from "./src/pages/profile"
import Mock from "./src/pages/MockTest";



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(adduser(JSON.parse(user)));
    }
  }, [dispatch]);

  return (
    <div className='   '>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/mock-test" element={<MockTest />} /> {/* Add Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mock" element={<Mock />} />
        
        <Route path="/categories/:cat" element={<Testwindow />} />
        <Route path="/qchose" element={<QuizParent />} />
      </Routes>




    </div>
  )
}
export default App