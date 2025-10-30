import React from 'react';

import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

const categories = [
  { name: "General Knowledge", color: "from-blue-400 to-blue-600" },
  { name: "Science", color: "from-green-400 to-green-600" },
  { name: "Geopolitics", color: "from-red-400 to-red-600" },
  { name: "Sports", color: "from-yellow-400 to-yellow-500" },
];

const Home = () => {
  return (
<>
    <Navbar/>

    <div className="bg-linear-to-r from-orange-200 via-purple-500 to-pink-500  h-auto flex flex-col justify-between text-gray-800 font-sans">
  
      <header className="px-9 py-20 text-white   ">
        <h1 className="text-6xl font-extrabold tracking-wide  mb-4">Welcome to QuizKar</h1>
        <p className="text-lg max-w-4xl mb-25 f3">
          Your ultimate platform to create, take, and share quizzes. Challenge yourself or your friends with random quizzes or create your own customized quizzes!
        </p>
        
        <div
           
            className='bg--to-r  from-orange-200 via-purple-500  to-pink-500  text-white rounded-xl p-6 shadow-lg hover:scale-105 transform transition duration-300'
          >
           
                 <h1 className='text-center f4 text-3xl'>Multiple  categories</h1>
               <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               
      {categories.map((cat) => (
        <div
          key={cat.name}
          className={`bg-linear-to-r ${cat.color} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 cursor-pointer`}
        >
          <h2 className="text-2xl font-bold mb-2">{cat.name}</h2>
          <p className="text-sm f3">Explore quizzes in {cat.name} and test your knowledge!</p>
        </div>
      ))}

    </div> 

</div>
            
      </header>
         
         <Link to="/qchose">
            <button  
             className="className=' f3 ml-170 px-10 py-3 bg-orange-100 rounded-sm active:scale-95"
              >Get Started</button></Link>
          
    
      
      <footer className="bg-amber-200 mt-50 h-2 text-gray-600 p-10 text-center text-sm">
        &copy; {new Date().getFullYear()} Quiz Website. All rights reserved.
      </footer>

    </div>

    </>
  );
};

export default Home;
