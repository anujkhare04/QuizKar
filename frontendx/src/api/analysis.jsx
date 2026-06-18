import axiosInstance from "../axios/axiosinstance";
import { useSelector } from "react-redux";






export const SavedStats = async (data) => {

  // console.log(data);


  try {
    let res = await axiosInstance.post('/quiz/saved', data)

    if (res) {

      console.log("Quiz Stats Saved");
      return res.data;

    }
  } catch (error) {
    console.log("Error in Saving Stats", error);
   
  }

};

export const getsaved=async(userId)=>{
    try {
          
        console.log(userId);
        
        const getanalyis=await axiosInstance.get( `/quiz/getsaved/${userId}`)
        
        if (getanalyis) {
      return getanalyis.data
     
    }

    } catch (error) {
        console.log("error while fetch score");
     
    }
} 


export const getperformance=async(userId,range)=>{
    try {
          
        console.log(userId);
        console.log(range);
        
        const getperform=await axiosInstance.get( `/quiz/performance/${userId}?range=${range}`)
        
        if (getperform) {
      return getperform.data
     
    }

    } catch (error) {
        console.log("error while fetch Performance");
     
    }
} 

export const getLeaderboard = async (range = "global", limit = 50) => {
  try {
    const res = await axiosInstance.get(`/quiz/leaderboard?range=${range}&limit=${limit}`);
    return res?.data;
  } catch (error) {
    console.log("error while fetch leaderboard");
    throw error;
  }
};

