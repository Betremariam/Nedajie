import { ThemeToggle } from "./ThemeToggle";
import { Fuel } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-8">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-gradient p-2 rounded-xl text-primary-foreground shadow-lg shadow-brand-500/20 ring-2 ring-brand-100 dark:ring-brand-900/50">
            <Fuel className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-foreground leading-none">
              Fuel Control <span className="text-primary">System</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">
              Efficiency redefined
            </span>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end border-r pr-6 border-brand-100 dark:border-brand-900">
            <p className="text-sm font-semibold text-foreground">Welcome, Admin</p>
            <p className="text-xs text-primary font-semibold">Super Admin Portal</p>
          </div>
          
            <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="group relative cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-primary p-[2px] transition-transform hover:scale-105 active:scale-95">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-primary font-semibold border-2 border-background">
                  A
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-brand-500 border-2 border-background shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

