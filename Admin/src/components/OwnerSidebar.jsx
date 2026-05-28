import { LayoutDashboard, Fuel, Users, History, BarChart3, Truck } from "lucide-react";
import BaseSidebar from "./BaseSidebar";
import { useTranslation } from "react-i18next";

const OwnerSidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { title: t("navDashboard"), url: "/owner/dashboard", icon: LayoutDashboard },
    { title: t("navAttendants"), url: "/owner/attendant", icon: Users },
    { title: t("navFuelInflow"), url: "/owner/fuel-received", icon: Fuel },
    { title: t("navPendingDeliveries"), url: "/owner/pending-deliveries", icon: Truck },
    { title: t("navTransactions"), url: "/owner/transactions", icon: History },
    { title: t("navAnalytics"), url: "/owner/reports", icon: BarChart3 },
  ];

  return (
    <BaseSidebar navItems={navItems} label="sidebarOwnerPortal" roleTitle="sidebarStationOwner" />
  );
};

export default OwnerSidebar;
