import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import ManageAdmins from "./pages/SuperAdmin/ManageAdmins";
import FuelStockManager from "./pages/SuperAdmin/FuelStockManager";
import TransactionHistory from "./pages/SuperAdmin/TransactionHistory";
import DriverLists from "./pages/SuperAdmin/DriverLists";
import FarmerLists from "./pages/SuperAdmin/FarmerLists";
import OtherLists from "./pages/SuperAdmin/OtherLists";
import FuelDilevery from "./pages/SuperAdmin/FuelDilevery";
import AdminLayout from "./layouts/SuperAdminLayout ";

// Register Admin Pages
import RegisterAdminDashboard from "./pages/RegisterAdmin/RegisterAdminDashboard";
import RegisterAdminLayout from "./layouts/RegisterAdminlayout";
import RegisterAttendant from "./pages/RegisterAdmin/RegisterAttendant";
import RegisterDriver from "./pages/RegisterAdmin/RegisterDriver";
import RegisterFarmer from "./pages/RegisterAdmin/RegisterFarmer";
import OtherRegistration from "./pages/RegisterAdmin/OtherRegistration";

import ApproverAdminLayout from "./layouts/ApproverAdminLayout";
import ApproveDrivers from "./pages/ApproverAdmin/ApproveDrivers";
import ApproveFarmers from "./pages/ApproverAdmin/ApproveFarmers";
import ApproveAttendants from "./pages/ApproverAdmin/ApproveAttendants";
import ApproveOthers from "./pages/ApproverAdmin/ApproveOthers";
import ApproveDashboard from "./pages/ApproverAdmin/ApproverDashboard";

import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/Owner/Dashboard";
import RegisterAttendants from "./pages/Owner/Attendant";
import OwnerTransactions from "./pages/Owner/OwnerTransactions";
import OwnerReports from "./pages/Owner/Reports";
import FuelReceived from "./pages/Owner/FuelReceived";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<AdminLayout />}>
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />}/>
        <Route path="/super-admin/manage-admins" element={<ManageAdmins />} />
        <Route path="/super-admin/fuel-stock" element={<FuelStockManager />} />
        <Route path="/super-admin/transactions" element={<TransactionHistory />}/>
        <Route path="/super-admin/drivers-list" element={<DriverLists />} />
        <Route path="/super-admin/farmers-list" element={<FarmerLists />} />
        <Route path="/super-admin/others-list" element={<OtherLists />} />
        <Route path="/super-admin/fuel-delivery" element={<FuelDilevery />} />
        
        </Route>

          {/* Register Admin Routes */}
        <Route path="/register" element={<RegisterAdminLayout />}>
          <Route path="/register/register-dashboard" element={<RegisterAdminDashboard />} />
          <Route path="/register/attendant-registration" element={<RegisterAttendant />} />
          <Route path="/register/driver-registration" element={<RegisterDriver />} />
          <Route path="/register/farmer-registration" element={<RegisterFarmer />} />
          <Route path="/register/other-registration" element={<OtherRegistration />} />
        </Route>
          
          {/* Register Admin Routes */}
          <Route path="/approver" element={<ApproverAdminLayout />}>
          <Route path="/approver/dashboard" element={<ApproveDashboard/>} />
          <Route path="/approver/drivers" element={<ApproveDrivers/>} />
          <Route path="/approver/farmers" element={<ApproveFarmers/>} />
          <Route path="/approver/attendants" element={<ApproveAttendants/>} />
          <Route path="/approver/others" element={<ApproveOthers/>} />
         </Route>

         <Route path="/owner" element={<OwnerLayout />}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="attendant" element={<RegisterAttendants />} />
          <Route path="transactions" element={<OwnerTransactions />} />
          <Route path="reports" element={<OwnerReports />} />
          <Route path="fuel-received" element={<FuelReceived />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
















