import SuperAdminSidebar from "../components/SuperAdminSidebar";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
