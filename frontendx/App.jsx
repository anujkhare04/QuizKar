import React from 'react'

import Home from "./src/pages/home";
import CreateQuiz from "./src/pages/creatquiz";
import Login from "./src/pages/login";
import Random from "./src/pages/random";
// import Quizchoose from "./pages/quizchose";
// import Testsetup from "./pages/testsetup";
import { Route,Routes } from "react-router-dom";
import QuizParent from "./src/pages/quizparents";
import Testwindow from "./src/pages/testwindow";


const App = () => {
  return (
    <div className='   '>
      
      
        
         <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/login" element={<Login />} />
         <Route path="/Random" element={<Random />} />
         
          
           <Route path="/categories/:cat" element={<Testwindow />} />
           <Route path="/qchose" element={<QuizParent />} />
      </Routes>

  


    </div>
  )
}
export default App