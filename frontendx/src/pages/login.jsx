import React from 'react';
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center p-6 bg-linear-to-r from-orange-200 via-purple-500 to-pink-500">
      <form className="p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-normal f2 text-black text-center mb-2  ">Login to Your Account</h2>
        <h1 className='h-1 shadow-md'></h1>
      
        <div>
          <label htmlFor="email" className="block text-black font-semibold mb-2">Email*</label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-6 shadow-lg rounded-md focus:outline-none text-black"
            placeholder="Enter your email"
          />
        </div>

        
        <div>
          <label htmlFor="password" className="block text-black font-semibold mb-2">Password*</label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-6 shadow-lg rounded-md focus:outline-none text-black"
            placeholder="Enter your password"
          />
        </div>

       
        <button
          type="submit"
          className="w-full  bg-purple-600 hover:bg-purple-700 text-black font-semibold py-3 rounded-md transition active:scale-98"
        >
          Login
        </button>

        <button className='ml-30 shadow-md text-white f4 p-3 rounded-2xl'><Link to='/'>Create New Account</Link></button>
      </form>
    </div>
  );
};

export default LoginPage;
