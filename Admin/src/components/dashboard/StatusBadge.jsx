import React from "react";
import { cn } from "../../lib/utils";

const StatusBadge = ({ status, className }) => {
  const getStatusConfig = (status) => {
    const s = status?.toUpperCase().replace(/_/g, " ");
    if (s?.includes("ACCEPTED") || s?.includes("APPROVED") || s?.includes("ACTIVE") || s?.includes("RECEIVED") || s?.includes("SUCCESS")) {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
    }
    if (s?.includes("PENDING") || s?.includes("WAITING")) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
    }
    if (s?.includes("ERROR") || s?.includes("FAILED") || s?.includes("REJECTED") || s?.includes("BLOCKED")) {
      return "bg-destructive/10 text-destructive border-destructive/20";
    }
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap",
      getStatusConfig(status),
      className
    )}>
      {status?.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
