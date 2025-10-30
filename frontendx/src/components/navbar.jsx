import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='  bg-linear-to-r from-orange-200 via-purple-500 to-pink-500   flex items-center  justify-between p-10'>
      <div>
        <h1 className=' f2 text-3xl text-white'>QuizKar</h1>
      </div>

      <div className=' f3 text-md flex items-center justify-between gap-10'>
        <Link to="/"><h1>Home</h1></Link>
        <Link to="/create-quiz">  <h1 >Create Quiz</h1></Link>
        <Link to="/login"> <h1>Login</h1></Link>
        <Link to="/random"> <button className='bg-orange-100 p-2 rounded-2xl active:scale-95'>Random Quiz</button></Link>

      
       
       
      </div>
    </div>
  )
}

export default Navbar
