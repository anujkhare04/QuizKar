import React from "react";
import { useNavigate } from "react-router-dom";

const Auth = ({ onContinueGuest }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md rounded-[30px] border border-white/20 bg-white/10 p-6 md:p-8 text-white backdrop-blur-xl">
      <h2 className="text-center text-3xl font-black f3">Welcome</h2>
      <p className="mt-2 text-center text-sm text-white/70">
        Choose how you want to continue
      </p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full rounded-2xl bg-white py-3 font-black uppercase tracking-widest text-purple-600"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full rounded-2xl border border-white/40 bg-transparent py-3 font-black uppercase tracking-widest text-white"
        >
          Register
        </button>

        
      </div>
    </div>
  );
};

export default Auth;
