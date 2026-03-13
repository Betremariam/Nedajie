import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../components/ui/Sidebar";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const DashboardLayout = ({ Sidebar }) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-dashboard-gradient transition-colors duration-500 min-h-[calc(100vh-var(--header-height)-var(--footer-height))]">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-card/50 backdrop-blur-sm text-card-foreground rounded-2xl shadow-xl shadow-brand-500/5 border border-brand-100/20 dark:border-brand-900/20 p-6 md:p-8">
              <Outlet />
            </div>
          </div>
        </main>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

