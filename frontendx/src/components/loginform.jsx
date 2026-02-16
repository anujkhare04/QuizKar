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
      className="space-y-6   p-8 rounded-xl shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl f4 font-bold text-center text-white mb-5">
        Login
      </h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
          className={`w-full px-4 py-2 rounded border  ${errors.username ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
        />
        {errors.username && (
          <span className="text-sm text-red-500">
            {errors.username.message}
          </span>
        )}
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className={`w-full px-4 py-2 rounded border ${errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-600`}
        />
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-black text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
      >
        Login
      </button>
      <div className="text-center mt-4 text-sm text-black">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="text-white hover:underline font-semibold"
          onClick={() => setflag((prev) => !prev)}
        >
          Register here
        </button>
      </div>
    </form>

  );
};

export default LoginForm;
