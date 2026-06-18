import React from "react";

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-3 group cursor-pointer select-none ${className}`}>
            <div className="relative flex items-center justify-center">
                
                <div className="absolute -inset-2 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-20 group-hover:opacity-60 group-hover:blur-lg transition-all duration-700 animate-pulse"></div>

                <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 border-[2.5px] border-white/40 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-500 ease-out"></div>
                    <div className="absolute inset-1.5 border-[2.5px] border-orange-400 rounded-lg -rotate-12 group-hover:rotate-0 transition-transform duration-500 ease-out delay-75"></div>
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                </div>
            </div>

            <div className="flex flex-col leading-none">
                <h1 className="text-3xl font-black tracking-tighter flex items-center overflow-hidden">
                    <span className="relative inline-block text-white group-hover:translate-y-[-0.5] transition-transform duration-300">
                        Quiz
                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    </span>
                    <span className="text-shimmer ml-1 italic drop-shadow-sm group-hover:skew-x-[-10deg] transition-transform duration-300">
                        Kar
                    </span>
                </h1>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1">
                    Play • Learn • Win
                </span>
            </div>
        </div>
    );
};

export default Logo;
