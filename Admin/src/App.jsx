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

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import { ThemeProvider } from "./components/ThemeProvider";

// Sidebars
import SuperAdminSidebar from "./components/SuperAdminSidebar";
import RegisterAdminSidebar from "./components/RegisterAdminSidebar";
import ApproverSidebar from "./components/ApproverSidebar";
import OwnerSidebar from "./components/OwnerSidebar";

// Register Admin Pages
import RegisterAdminDashboard from "./pages/RegisterAdmin/RegisterAdminDashboard";
import RegisterAttendant from "./pages/RegisterAdmin/RegisterAttendant";
import RegisterDriver from "./pages/RegisterAdmin/RegisterDriver";
import RegisterFarmer from "./pages/RegisterAdmin/RegisterFarmer";
import OtherRegistration from "./pages/RegisterAdmin/OtherRegistration";

// Approver Admin Pages
import ApproveDrivers from "./pages/ApproverAdmin/ApproveDrivers";
import ApproveFarmers from "./pages/ApproverAdmin/ApproveFarmers";
import ApproveAttendants from "./pages/ApproverAdmin/ApproveAttendants";
import ApproveOthers from "./pages/ApproverAdmin/ApproveOthers";
import ApproveDashboard from "./pages/ApproverAdmin/ApproverDashboard";

// Owner Pages
import OwnerDashboard from "./pages/Owner/Dashboard";
import RegisterAttendants from "./pages/Owner/Attendant";
import OwnerTransactions from "./pages/Owner/OwnerTransactions";
import OwnerReports from "./pages/Owner/Reports";
import FuelReceived from "./pages/Owner/FuelReceived";
import OwnerFuelStock from "./pages/Owner/OwnerFuelStock";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="fuel-control-theme">
      <Router>
        <Routes>
          <Route path="/" element={<AdminLogin />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin" element={<DashboardLayout Sidebar={SuperAdminSidebar} />}>
            <Route path="dashboard" element={<SuperAdminDashboard />}/>
            <Route path="manage-admins" element={<ManageAdmins />} />
            <Route path="fuel-stock" element={<FuelStockManager />} />
            <Route path="transactions" element={<TransactionHistory />}/>
            <Route path="drivers-list" element={<DriverLists />} />
            <Route path="farmers-list" element={<FarmerLists />} />
            <Route path="others-list" element={<OtherLists />} />
            <Route path="fuel-delivery" element={<FuelDilevery />} />
          </Route>

          {/* Register Admin Routes */}
          <Route path="/register" element={<DashboardLayout Sidebar={RegisterAdminSidebar} />}>
            <Route path="register-dashboard" element={<RegisterAdminDashboard />} />
            <Route path="attendant-registration" element={<RegisterAttendant />} />
            <Route path="driver-registration" element={<RegisterDriver />} />
            <Route path="farmer-registration" element={<RegisterFarmer />} />
            <Route path="other-registration" element={<OtherRegistration />} />
          </Route>
            
          {/* Approver Admin Routes */}
          <Route path="/approver" element={<DashboardLayout Sidebar={ApproverSidebar} />}>
            <Route path="dashboard" element={<ApproveDashboard/>} />
            <Route path="drivers" element={<ApproveDrivers/>} />
            <Route path="farmers" element={<ApproveFarmers/>} />
            <Route path="attendants" element={<ApproveAttendants/>} />
            <Route path="others" element={<ApproveOthers/>} />
          </Route>

          <Route path="/owner" element={<DashboardLayout Sidebar={OwnerSidebar} />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="fuelstock" element={<OwnerFuelStock />} />
            <Route path="attendant" element={<RegisterAttendants />} />
            <Route path="transactions" element={<OwnerTransactions />} />
            <Route path="reports" element={<OwnerReports />} />
            <Route path="fuel-received" element={<FuelReceived />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

















