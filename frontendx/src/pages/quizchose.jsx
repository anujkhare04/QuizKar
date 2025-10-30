import React, { useState,useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link ,useNavigate } from "react-router-dom";
import Testsetup from "./testsetup";
import { getAllCategories } from "../api/createApi";



const quizchose = ({setQuizData}) => {

    const [formdata, setformdata] = useState('')
    const [categories, setCategories] = useState([]);

   

  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      type: "",
      questionLimit: 5,
       timeLimit: 1,
    
    },
  });


  

  const watchType = watch("type");
  const selectedCategory = watch("category");

  

  const onsubmit = (data) => {

    
   
     if (data.type !== "numberOfQuestions") {
    delete data.questionLimit;
  }
    
    setformdata(data);
    

    const finalData = { ...data, category: data.category };

    setQuizData(finalData); 

    
    
       


  };

  useEffect(() => {
    
  console.log("formData updated:", formdata);
}, [formdata]);

useEffect(() => {

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories()
      
      
      const mappedCategories = data.map((cat) => ({
        name: cat,
        
      }));
      
      setCategories(mappedCategories);

    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  fetchCategories();
}, []);

  return (
    <div className="bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 min-h-screen ">

       
      <h1 className="text-4xl font-normal f2 py-10 shadow-md text-black  text-center ">
        Take the Quiz
      </h1>

      <form onSubmit={handleSubmit(onsubmit)}>

        <h1 className="f3 px-6 mt-10 text-xl ">Select categories</h1>
        <div className="p-10  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {categories.map((cat) => (
          <label
            key={cat.name}
            className={`relative bg-linear-to-r ${cat.color} text-white rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition duration-300
            ${selectedCategory === cat.name ? "ring-4 ring-yellow-400" : ""}`}
          >
            
            <input
              type="radio"
              value={cat.name}
              {...register("category", { required: true })}
              className="absolute opacity-0 cursor-pointer"
            />

           
            <div>
              <h2 className="text-2xl font-bold mb-2">{cat.name}</h2>
              <p className="text-sm">Explore quizzes in {cat.name} and test your knowledge!</p>
            </div>
          </label>
        ))}

        </div>

        <div className="w-60 ">
          <h1 className=" f3 px-6 mt-10 text-xl ">Select Types of Test</h1>

          <select
            {...register("type",{ required: true })}
            className="w-full mt-6 ml-5 h-10 p-2 text-black shadow-md focus:outline-none "
            name="type"
            id=""
          >
            <option value="">Select</option>
            <option value="timed">Time</option>
            <option value="Stop on Incorrect">Stop on Incorrect</option>
            <option value="numberOfQuestions">Number of Questions</option>
          </select>

          {watchType === "numberOfQuestions" && (
            <div className="mb-4 p-8">
              <label className="block mb-1  f3">Number of Questions</label>
              <input
               min={5} 
                max={10} 
                type="number"
                {...register("questionLimit", { min: 5 },{max:10})}
                className="w-full h-10 p-2 text-black shadow-md focus:outline-none"
                placeholder="Enter number of questions"
              />
            </div>
          )}
          {watchType === "timed" && (
            <div className="mb-4 p-8">
              <label className="block mb-1  f3">Set Time (in min)</label>
              <input
                type="number"
                 min={1}
                {...register("timeLimit", { min: 1 })}
                className="w-full h-10 p-2 text-black shadow-md focus:outline-none"
                placeholder="Enter Time"
              />
            </div>
          )}
             
             


     

          
            <button
              type="submit"
              className=" mb-10 mt-20 ml-150 w-full px-10 py-2 bg-purple-600 hover:bg-purple-700 text-black font-semibold  active:scale-98 rounded-md transition"
            >
              Submit
            </button>
      
        </div>
      </form>

      
    </div>
  );
};

export default quizchose;
