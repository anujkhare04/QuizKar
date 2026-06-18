import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser,forgotpass } from "../api/authapi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adduser } from "../feature/auth.slice";
import Logo from "./Logo";
import {toast} from "react-toastify";
import Loader  from "./loader";




const LoginForm = ({ setflag }) => {
  const { user } = useSelector((state) => state.auth);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [Esent, setEsent] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {

      username: "",

      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      let loggedinUser = await loginUser(data);

      console.log(loggedinUser);


      if (loggedinUser) {
        dispatch(adduser(loggedinUser))
        navigate("/");
      }
      reset();


    } catch (error) {
      console.log("error in login form", error);
    } finally {
      setLoading(false);
    }
  };

  const forget=async()=>{
 
    if(!email){
      toast.error("Please enter your email");
      return;
    }

      if (loading) return;

        setLoading(true);


    try {
      let forgot =await forgotpass(email)
       console.log(forgot);
       setEsent(true);
      
    } catch (error) {
        console.log("error in forgot password", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8 md:p-12  rounded-[30px] shadow-2xl w-full  max-w-md bg-white/10 backdrop-blur-xl border border-white/20 animate-in fade-in zoom-in duration-500"
    >
      <div className="text-center  overflow-hidden mb-8 relative">
        <h2 className="text-3xl md:text-4xl f3 font-black text-white mb-2">
          Login
        </h2>

        <p className="text-white/60 text-sm font-medium">
          Welcome back! Please enter your details.
        </p>
      </div>
 
      <div className="space-y-4 ">
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
            className={`w-full px-4 sm:px-5 py-3 sm:py-4  rounded-2xl bg-white/5 border text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${
              errors.username ? "border-red-400" : "border-white/10"
            }`}
          />
          {errors.username && (
            <span className="text-xs text-red-300 ml-2 mt-1 block font-medium">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className={`w-full  rounded-2xl bg-white/5 border px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${
              errors.password ? "border-red-400" : "border-white/10"
            }`}
          />
          {errors.password && (
            <span className="text-xs text-red-300 ml-2 mt-1 block font-medium">
              {errors.password.message}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="p-2 text-sm font-bold hover:text-yellow-400"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all mt-4 uppercase tracking-widest"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <div className="text-center mt-6 text-sm text-white/70">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="text-white hover:text-yellow-400 font-bold underline decoration-white/20 underline-offset-4 transition-colors"
          onClick={() => setflag((prev) => !prev)}
        >
          Register for free
        </button>
      </div>

      {showForgot && (
        <div className="fixed  rounded-4xl flex flex-col   gap-5 inset-0 bg-black p-4 sm:p-6  backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full space-y-2 max-w-md mx-4 p-6 sm:p-8   rounded-2xl">
            <h2 className="text-3xl md:text-4xl f3  font-black text-white mb-2">
              Reset Password
            </h2>

            {loading && <Loader />}

            {!Esent ? (
              
              <div className="w-full flex flex-col gap-10">
                <p className="text-white/60 text-sm  font-medium">
                  Please enter your registered email
                </p>
 
                <div className="flex items-center justify-between gap-4">
                  <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-sm max-w-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all rounded-lg px-5 border-3 py-2"
                />

                
                  <button
                    className="text-white hover:text-yellow-400 font-bold underline decoration-white/20 underline-offset-4 transition-colors"
                    type="button"
                    onClick={forget}
                  >
                   <i className="ri-send-plane-fill bg-white p-2  text-black rounded-3xl"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-10 items-center justify-center"> 
                <p className="text-green-400 text-sm font-medium mt-4  text-center">
                  A password reset link has been sent to <span className="font-semibold">{email || "your email"}</span>. Check your inbox and follow the instructions.
                </p>
                <button
                  onClick={() => setEsent(false)}
                  className="text-white hover:text-yellow-400 flex  font-bold underline decoration-white/20 underline-offset-4 transition-colors"
                >
                  Try Another Email
                </button>
               </div> 




            )}

            
            
          </div>

          <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="mt-6 px-6 py-1 rounded-2xl bg-white text-black"
            >
              back
            </button>
        </div>
      )}

       
     
    </form>
  );
};

export default LoginForm;
