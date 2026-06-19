import axiosInstance from "../axios/axiosinstance";
import { toast } from "react-toastify";

export const registerUser = async (data) => {
  try {
    console.log("sending data:", data);
    let newUser = await axiosInstance.post("/auth/register", data);  
    console.log(newUser);
    if (newUser) {
      console.log("User Registered  ");
      toast.success("User Registered !!");
      if (newUser.data?.token) {
        localStorage.setItem("token", newUser.data.token);
      }
      return newUser.data;
    }
  } catch (error) {
    const message =
      error?.response?.data?.message || "Registration failed. Please try again.";
    console.log("error in registration", error);
    toast.error(message);
    throw new Error(message);
  }
};

export const loginUser = async (data) => {
  try {
    console.log("Sending login data:", data);
    let loggedinUser = await axiosInstance.post("/auth/login", data);
    console.log(loggedinUser);
    
    if (loggedinUser) {
      console.log("user logged in ");
      toast.success("User logged in !!");
      if (loggedinUser.data?.token) {
        localStorage.setItem("token", loggedinUser.data.token);
      }
      return loggedinUser.data.user;
    }
  } catch (error) {
    const message =
      error?.response?.data?.message || "Login failed. Please try again.";
    console.log("error in Login", error);
    toast.error(message);
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  try {
    let res = await axiosInstance.post("/auth/logout");
    localStorage.removeItem("token");
    if (res) {
      toast.success("User logout ");
      return res.data.message;                     
    }
  } catch (error) {
    console.log("error in logout", error);
    localStorage.removeItem("token");
  }
};

export const forgotpass = async (email) => {
  try { 
    let res = await axiosInstance.post("/auth/forgot", { email });
    if (res) {
      toast.success("If an account exists, a reset link has been sent.");
      return res.data.message;                     
    }
  } catch (error) {
    console.log("error in Email Sent to reset password", error);
  }
};  

export const updateProfileApi = async (formData) => {
  try {
    const res = await axiosInstance.put("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Profile updated successfully");
    return res.data?.user;
  } catch (error) {
    const message = error?.response?.data?.message || "Failed to update profile";
    toast.error(message);
    throw new Error(message);
  }
};
