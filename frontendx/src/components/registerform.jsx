import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../api/authapi";

import { adduser } from "../feature/auth.slice";

const RegisterForm = ({ setflag }) => {
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
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // console.log(data);

      const newUserObj = {
        username: data.username,
        email: data.email,

        password: data.password,
        fullname: {
          firstname: data.firstName,
          lastname: data.lastName,
        },
      };

      // console.log(newUserObj);

      const res = await registerUser(newUserObj);

      console.log(res.Regsiteruser);

      if (res.Regsiteruser) {
        dispatch(adduser(res.Regsiteruser))
        navigate("/");
      }

      reset();



    } catch (error) {
      console.log("Error in registration form:", error);
      reset();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 animate-in fade-in zoom-in duration-500"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 f3">Create Account</h1>
          <p className="text-white/60 text-sm font-medium">Join the quiz community today!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <input
              type="text"
              placeholder="First Name"
              defaultValue={user?.fullName?.firstName}
              disabled={user ? true : false}
              {...register("firstName", { required: "First name is required" })}
              className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.firstName ? "border-red-400" : "border-white/10"
                }`}
            />
            {errors.firstName && (
              <span className="text-xs text-red-300 ml-2 font-medium">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="text"
              placeholder="Last Name"
              defaultValue={user?.fullName?.lastName}
              disabled={user ? true : false}
              {...register("lastName", { required: "Last name is required" })}
              className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.lastName ? "border-red-400" : "border-white/10"
                }`}
            />
            {errors.lastName && (
              <span className="text-xs text-red-300 ml-2 font-medium">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Username"
              defaultValue={user?.username}
              disabled={user ? true : false}
              {...register("username", { required: "Username is required" })}
              className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.username ? "border-red-400" : "border-white/10"
                }`}
            />
            {errors.username && (
              <span className="text-xs text-red-300 ml-2 font-medium">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="email"
              placeholder="Email"
              defaultValue={user?.email}
              disabled={user ? true : false}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
              className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.email ? "border-red-400" : "border-white/10"
                }`}
            />
            {errors.email && (
              <span className="text-xs text-red-300 ml-2 font-medium">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Password"
              defaultValue={user?.password}
              disabled={user ? true : false}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.password ? "border-red-400" : "border-white/10"
                }`}
            />
            {errors.password && (
              <span className="text-xs text-red-300 ml-2 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all mt-4 uppercase tracking-widest"
        >
          Create Account
        </button>

        <div className="text-center mt-6 text-sm text-white/70 flex items-center justify-center gap-2">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={() => setflag((prev) => !prev)}
            className="text-white hover:text-yellow-400 font-bold underline decoration-white/20 underline-offset-4 transition-colors"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
