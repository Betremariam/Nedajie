import { LayoutGrid, Fuel, Car, Wheat, Users2, Home } from "lucide-react";
import BaseSidebar from "./BaseSidebar";
import { useTranslation } from "react-i18next";

const RegisterAdminSidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { title: t("navDashboard"), url: "/register/register-dashboard", icon: LayoutGrid },
    { title: t("navVehicles"), url: "/register/vehicle-registration", icon: Car },
    { title: t("navFarmers"), url: "/register/farmer-registration", icon: Wheat },
    { title: t("navMillHouses"), url: "/register/mill-house-owner-registration", icon: Home },
    { title: t("navOthers"), url: "/register/other-registration", icon: Users2 },
  ];

  return (
    <BaseSidebar navItems={navItems} label="sidebarEnrollment" roleTitle="sidebarRegistryAdmin" />
  );
};

export default RegisterAdminSidebar;
