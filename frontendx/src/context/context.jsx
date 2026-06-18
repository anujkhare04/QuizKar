import { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getsaved,getperformance } from "../api/analysis";

export const PerContext = createContext();

export const Pcontext = ({ children }) => {
  
  const [Pdata, setPdata] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user ?? user;
  const userId = currentUser?._id;
  
  const defaultRange = "yearly";
useEffect(() => {
  const fetchDataAndAnalyze = async () => {
    
    if (!userId ) {
      setPdata([]);
      return;
    }

    try {
      const res = await getperformance(userId, defaultRange);
      if (res) {
        setPdata(res);
      }
    } catch (error) {
      console.error("Error in analysis flow:", error);
    }
  };

  fetchDataAndAnalyze();
}, [userId]); 


  





  

  return (
    <PerContext.Provider value={{Pdata}}>
          {children}
       </PerContext.Provider>
  );

};
