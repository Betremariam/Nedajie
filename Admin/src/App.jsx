import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import ChangePassword from "./pages/ChangePassword";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import ManageAdmins from "./pages/SuperAdmin/ManageAdmins";
import ManageStationOwners from "./pages/SuperAdmin/ManageStationOwners";
import FuelStockManager from "./pages/SuperAdmin/FuelStockManager";
import TransactionHistory from "./pages/SuperAdmin/TransactionHistory";
import VehicleLists from "./pages/SuperAdmin/VehicleLists";
import FarmerLists from "./pages/SuperAdmin/FarmerLists";
import MillHouseOwnerLists from "./pages/SuperAdmin/MillHouseOwnerLists";
import OtherLists from "./pages/SuperAdmin/OtherLists";
import FuelDelivery from "./pages/SuperAdmin/FuelDelivery";
import ConfirmDeliveries from "./pages/SuperAdmin/ConfirmDeliveries";

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
import RegisterVehicle from "./pages/RegisterAdmin/RegisterVehicle";
import RegisterFarmer from "./pages/RegisterAdmin/RegisterFarmer";
import RegisterMillHouseOwner from "./pages/RegisterAdmin/RegisterMillHouseOwner";
import OtherRegistration from "./pages/RegisterAdmin/OtherRegistration";

// Approver Admin Pages
import ApproveVehicles from "./pages/ApproverAdmin/ApproveVehicles";
import ApproveFarmers from "./pages/ApproverAdmin/ApproveFarmers";
import ApproveMillHouseOwners from "./pages/ApproverAdmin/ApproveMillHouseOwners";
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
import PendingDeliveries from "./pages/Owner/PendingDeliveries";

// Federal Pages
import FederalSidebar from "./components/FederalSidebar";
import FederalDashboard from "./pages/Federal/FederalDashboard";
import ManageSuperAdmins from "./pages/Federal/ManageSuperAdmins";
import ManageOwners from "./pages/Federal/ManageOwners";
import FuelDeliveries from "./pages/Federal/FuelDeliveries";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="fuel-control-theme">
      <Router>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin" element={<DashboardLayout Sidebar={SuperAdminSidebar} />}>
            <Route path="dashboard" element={<SuperAdminDashboard />}/>
            <Route path="manage-admins" element={<ManageAdmins />} />
            <Route path="manage-owners" element={<ManageStationOwners />} />
            <Route path="fuel-stock" element={<FuelStockManager />} />
            <Route path="transactions" element={<TransactionHistory />}/>
            <Route path="vehicles-list" element={<VehicleLists />} />
            <Route path="farmers-list" element={<FarmerLists />} />
            <Route path="mill-house-owners-list" element={<MillHouseOwnerLists />} />
            <Route path="others-list" element={<OtherLists />} />
            <Route path="fuel-delivery" element={<FuelDelivery />} />
            <Route path="confirm-deliveries" element={<ConfirmDeliveries />} />
          </Route>

          {/* Register Admin Routes */}
          <Route path="/register" element={<DashboardLayout Sidebar={RegisterAdminSidebar} />}>
            <Route path="register-dashboard" element={<RegisterAdminDashboard />} />
            <Route path="vehicle-registration" element={<RegisterVehicle />} />
            <Route path="farmer-registration" element={<RegisterFarmer />} />
            <Route path="mill-house-owner-registration" element={<RegisterMillHouseOwner />} />
            <Route path="other-registration" element={<OtherRegistration />} />
          </Route>
            
          {/* Approver Admin Routes */}
          <Route path="/approver" element={<DashboardLayout Sidebar={ApproverSidebar} />}>
            <Route path="dashboard" element={<ApproveDashboard/>} />
            <Route path="vehicles" element={<ApproveVehicles/>} />
            <Route path="farmers" element={<ApproveFarmers/>} />
            <Route path="mill-house-owners" element={<ApproveMillHouseOwners/>} />
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
            <Route path="pending-deliveries" element={<PendingDeliveries />} />
          </Route>

          {/* Federal Routes */}
          <Route path="/federal" element={<DashboardLayout Sidebar={FederalSidebar} />}>
            <Route path="dashboard" element={<FederalDashboard />} />
            <Route path="manage-super-admins" element={<ManageSuperAdmins />} />
            <Route path="manage-owners" element={<ManageOwners />} />
            <Route path="fuel-deliveries" element={<FuelDeliveries />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;















