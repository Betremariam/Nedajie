import { ClipboardCheck, LayoutGrid, Fuel, Car, Wheat, Users2, Home } from "lucide-react";
import BaseSidebar from "./BaseSidebar";

const navItems = [
  { title: "Dashboard", url: "/approver/dashboard", icon: LayoutGrid },
  { title: "Attendants", url: "/approver/attendants", icon: Fuel },
  { title: "Vehicles", url: "/approver/vehicles", icon: Car },
  { title: "Farmers", url: "/approver/farmers", icon: Wheat },
  { title: "Mill Houses", url: "/approver/mill-house-owners", icon: Home },
  { title: "Others", url: "/approver/others", icon: Users2 },
];

const ApproverSidebar = () => (
  <BaseSidebar navItems={navItems} label="Verification" roleTitle="Approver Admin" />
);

export default ApproverSidebar;
