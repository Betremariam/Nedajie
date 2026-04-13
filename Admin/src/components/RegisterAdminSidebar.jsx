import { LayoutGrid, Fuel, Car, Wheat, Users2 } from "lucide-react";
import BaseSidebar from "./BaseSidebar";

const navItems = [
  { title: "Dashboard", url: "/register/register-dashboard", icon: LayoutGrid },
  { title: "Drivers", url: "/register/driver-registration", icon: Car },
  { title: "Farmers", url: "/register/farmer-registration", icon: Wheat },
  { title: "Others", url: "/register/other-registration", icon: Users2 },
];

const RegisterAdminSidebar = () => (
  <BaseSidebar navItems={navItems} label="Enrollment" roleTitle="Registry Admin" />
);

export default RegisterAdminSidebar;
