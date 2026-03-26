import React from "react";
import { cn } from "../../lib/utils";

const DashboardHeader = ({ 
  icon: Icon, 
  title, 
  description, 
  actions,
  className 
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border", className)}>
      <div className="flex items-center gap-5">
        {Icon && (
          <div className="w-14 h-14 rounded-[16px] bg-sidebar-foreground flex items-center justify-center text-sidebar-background shadow-md">
            <Icon className="w-7 h-7" />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground text-[13px] font-medium">{description}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
