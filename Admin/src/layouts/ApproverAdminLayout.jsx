import { Outlet } from "react-router-dom";
import ApproverSidebar from "../components/ApproverSidebar"; 
import Navbar from "../components/navbar";

const ApproverAdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <ApproverSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-8 overflow-auto bg-gradient-to-br from-gray-50 to-blue-50 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-140px)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default ApproverAdminLayout;