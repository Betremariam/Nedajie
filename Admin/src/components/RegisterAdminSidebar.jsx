import { LayoutGrid, Fuel, Car, Wheat, Users2, Home } from "lucide-react";
import BaseSidebar from "./BaseSidebar";

const navItems = [
  { title: "Dashboard", url: "/register/register-dashboard", icon: LayoutGrid },
  { title: "Vehicles", url: "/register/vehicle-registration", icon: Car },
  { title: "Farmers", url: "/register/farmer-registration", icon: Wheat },
  { title: "Mill Houses", url: "/register/mill-house-owner-registration", icon: Home },
  { title: "Attendants", url: "/register/register-attendant", icon: Fuel },
  { title: "Others", url: "/register/other-registration", icon: Users2 },
];

const RegisterAdminSidebar = () => (
  <BaseSidebar navItems={navItems} label="Enrollment" roleTitle="Registry Admin" />
);

export default RegisterAdminSidebar;
