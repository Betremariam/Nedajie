import { Outlet } from "react-router-dom";
import ApproverSidebar from "../components/ApproverSidebar"; 
import Navbar from "../components/navbar";


const ApproverAdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ApproverSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};
export default ApproverAdminLayout;
