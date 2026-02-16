import React, { useState } from "react";

import Regsiterform from "../components/registerform";
import Loginform from "../components/loginform";


const auth = () => {
  const [flag, setflag] = useState(false);

  return (
  <div className="bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 flex items-center justify-center min-h-screen">
    
    {flag ? 
    (<Regsiterform setflag={setflag} />) 
    
    : (<Loginform setflag={setflag}/>)}
  
  </div>

  )
};

export default auth;


