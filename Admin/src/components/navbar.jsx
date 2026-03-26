import { ThemeToggle } from "./ThemeToggle";
import { Bell, Menu } from "lucide-react";
import { useSidebar } from "./ui/Sidebar";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          
          <div className="flex flex-col ml-2 sm:ml-0">
            <h1 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Fuel Control <span className="text-blue-600">System</span>
            </h1>
            <span className="text-[9px] uppercase tracking-[0.15em] text-blue-500/80 font-semibold leading-none mt-0.5">
              Efficiency redefined
            </span>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-5">
          <div className="hidden md:flex flex-col items-end pr-2">
            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-tight">Welcome, Admin</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Super Admin Portal</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <ThemeToggle />
             </div>
             
             <button className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                  3
                </span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

