import axios from "axios";
import axiosInstance from "../axios/axiosinstance";
import { adduser } from "../feature/auth.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


export const registerUser = async (data) => {
         
    
  

  try {
    console.log("sending data:", data);
    let newUser = await axiosInstance.post("/auth/register", data);  
     
    console.log(newUser);
      
    
       
    if (newUser) {
       console.log("User Registered  ");
      toast.success("User Registered !!");
      return newUser.data;
  
      

  
    }
  } catch (error) {
    console.log("error in registration", error);
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
      return loggedinUser.data.user;
    }
     
  } catch (error) {
    console.log("error in Login", error);
  }
};

export const logoutUser = async () => {
  try {
    let res = await axiosInstance.post("/auth/logout");

    if (res) {
       toast.success("User logout ");
      return res.data.message;                     
    }
  } catch (error) {
    console.log("error in logout", error);
  }
};

