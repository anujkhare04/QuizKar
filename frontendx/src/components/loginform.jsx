import React from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../api/authapi";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { adduser } from "../feature/auth.slice";

const LoginForm = ({ setflag }) => {
  const { user } = useSelector((state) => state.auth);
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
    }
  };

  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 animate-in fade-in zoom-in duration-500"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl f3 font-black text-white mb-2">
          Login
        </h2>
        <p className="text-white/60 text-sm font-medium">Welcome back! Please enter your details.</p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
            className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.username ? "border-red-400" : "border-white/10"
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
            className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.password ? "border-red-400" : "border-white/10"
              }`}
          />
          {errors.password && (
            <span className="text-xs text-red-300 ml-2 mt-1 block font-medium">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all mt-4 uppercase tracking-widest"
      >
        Sign In
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
    </form>

  );
};

export default LoginForm;
