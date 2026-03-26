import React from "react";
import { cn } from "../../lib/utils";

const MetricCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  description, 
  color = "blue",
  className 
}) => {
  const iconColors = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    purple: "bg-purple-500/10 text-purple-500",
    destructive: "bg-destructive/10 text-destructive",
  };

  const trendColors = {
    up: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
    down: "text-destructive bg-destructive/10 border-destructive/20",
    neutral: "text-muted-foreground bg-muted border-border",
  };

  const trendType = trend?.startsWith('+') ? 'up' : trend?.startsWith('-') ? 'down' : 'neutral';

  return (
    <div className={cn(
      "bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-[0.04] group-hover:scale-150 group-hover:opacity-[0.07] transition-all duration-500">
        {Icon && <Icon className="w-24 h-24" />}
      </div>
      <div className="flex flex-row items-center justify-between pb-4 relative z-10">
        <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </h3>
        {Icon && (
          <div className={cn("p-2 rounded-xl transition-colors", iconColors[color])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black tracking-tight text-foreground mb-1">
          {value}
        </div>
        <div className="flex items-center justify-between mt-2">
          {description && <p className="text-[11px] font-medium text-muted-foreground">{description}</p>}
          {trend && (
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", trendColors[trendType])}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
