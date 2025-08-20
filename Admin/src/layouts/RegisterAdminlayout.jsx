import RegisterAdminSidebar from "../components/RegisterAdminSidebar"
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

const RegisterAdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <RegisterAdminSidebar/>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default RegisterAdminLayout;