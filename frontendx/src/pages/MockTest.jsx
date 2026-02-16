import React, { useState, useEffect } from 'react';
import { generateMockTestTopic, evaluateMockTest } from '../api/createApi';
import { useNavigate } from 'react-router-dom';

const MockTest = () => {
   
    

    return (
      <div className="  min-h-screen bg-linear-to-r from-orange-200 via-purple-500 to-pink-500  shadow-md     ">
        <h1 className="   w-full fixed top-0 bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 text-2xl shadow-md py-6 f2  text-black font-normal text-center">
          AI Mock Test
        </h1>

        <form>
          <div className="mt-20 p-10">
            <label className="block text-black f3 mb-5 " htmlFor="topic">
              Write Your topic (optional)*
            </label>

            <input
              placeholder="Enter topic"
              className="
          
    caret-transparent
    focus:caret-black
     px-4 py-2 rounded-md shadow-md
    focus:outline-none focus:ring-2 focus:ring-purple-500
  "
            />

            <button className="p-6 ml-5">Submit</button>
          </div>

          
          <div className="mt-20 p-10">
            <button>Random Topic</button>
          </div>
        </form>
      </div>
    );
};

export default MockTest;
