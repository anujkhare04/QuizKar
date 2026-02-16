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
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-1 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-4">Register</h1>

        <input
          type="text"
          placeholder="First Name"
          defaultValue={user?.fullName?.firstName}
          disabled={user ? true : false}
          {...register("firstName", { required: "First name is required" })}
          className={`w-full px-4 py-2  border-b border-gray-100 ${errors.firstName ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
        />
        {errors.firstName && (
          <span className="text-xs text-red-500">
            {errors.firstName.message}
          </span>
        )}

        <input
          type="text"
          placeholder="Last Name"
          defaultValue={user?.fullName?.lastName}
          disabled={user ? true : false}
          {...register("lastName", { required: "Last name is required" })}
          className={`w-full px-4 py-2 border-b border-gray-100  ${errors.lastName ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
        />
        {errors.lastName && (
          <span className="text-xs text-red-500">
            {errors.lastName.message}
          </span>
        )}

        <input
          type="text"
          placeholder="Username"
          defaultValue={user?.username}
          disabled={user ? true : false}
          {...register("username", { required: "Username is required" })}
          className={`w-full px-4 py-2 border-b border-gray-100  ${errors.username ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
        />
        {errors.username && (
          <span className="text-xs text-red-500">
            {errors.username.message}
          </span>
        )}

        <input
          type="email"
          placeholder="Email"
          defaultValue={user?.email}
          disabled={user ? true : false}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
          })}
          className={`w-full px-4 py-2  border-b border-gray-100  ${errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}

        <input
          type="password"
          placeholder="Password"
          defaultValue={user?.password}
          disabled={user ? true : false}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
          className={`w-full px-4 py-2 rounded border ${errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
        />
        {errors.password && (
          <span className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}



        <button
          type="submit"
          className="w-full py-3 mt-4 bg-black text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-150"
        >
          Register
        </button>

        <div className="w-full flex items-center justify-center gap-1 f3 py-3 text-center mt-4 text-black rounded-lg">
          <h1>Already have an account?</h1>
          <button type="button" onClick={() => setflag((prev) => !prev)}>
            <h1 className=" text-white f5 hover:underline  ">Login</h1>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
