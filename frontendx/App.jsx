import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { adduser } from "./src/feature/auth.slice";
import Home from "./src/pages/home";
import CreateQuiz from "./src/pages/creatquiz";
import Login from "./src/pages/login";
import MockTest from "./src/pages/MockTest";
// import Quizchoose from "./pages/quizchose";
// import Testsetup from "./pages/testsetup";
import { Route, Routes } from "react-router-dom";
import QuizParent from "./src/pages/quizparents";
import Testwindow from "./src/pages/testwindow";
import Profile from "./src/components/profile";
import MainLayout from "./src/components/MainLayout";
import AuthLayout from "./src/components/AuthLayout";
import { axiosInstance } from "./src/axios/axiosinstance";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./src/pages/Dashboard";
import ResetPassword from "./src/pages/resetpassword";
import { Pcontext } from "./src/context/context";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile");
        console.log(res);

        dispatch(adduser(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Pcontext>
        <Routes>
          {/* <Route element={<MainLayout />}> */}
            <Route path="/" element={<Home />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
          {/* </Route> */}

          {/* <Route element={<AuthLayout />}> */}
            <Route path="/mocktest" element={<MockTest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/reset/:token" element={<ResetPassword />} />

            <Route path="/categories/:cat" element={<Testwindow />} />
            <Route path="/qchose" element={<QuizParent />} />
          {/* </Route> */}
        </Routes>
      </Pcontext>
    </div>
  );
};
export default App;
