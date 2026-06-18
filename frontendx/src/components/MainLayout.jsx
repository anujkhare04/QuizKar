import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="h-screen bg-black overflow-hidden">
      <Navbar />
      <main className="mt-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
