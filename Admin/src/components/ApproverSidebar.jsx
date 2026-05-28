import { ClipboardCheck, LayoutGrid, Fuel, Car, Wheat, Users2, Home } from "lucide-react";
import BaseSidebar from "./BaseSidebar";
import { useTranslation } from "react-i18next";

const ApproverSidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { title: t("navDashboard"), url: "/approver/dashboard", icon: LayoutGrid },
    { title: t("navAttendants"), url: "/approver/attendants", icon: Fuel },
    { title: t("navVehicles"), url: "/approver/vehicles", icon: Car },
    { title: t("navFarmers"), url: "/approver/farmers", icon: Wheat },
    { title: t("navMillHouses"), url: "/approver/mill-house-owners", icon: Home },
    { title: t("navOthers"), url: "/approver/others", icon: Users2 },
  ];

  return (
    <BaseSidebar navItems={navItems} label="sidebarVerification" roleTitle="sidebarApproverAdmin" />
  );
};

export default ApproverSidebar;
