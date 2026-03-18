import React from "react";
import { 
  Users, 
  Truck, 
  UserPlus, 
  ShieldCheck, 
  Activity, 
  TrendingUp,
  ArrowUpRight,
  Globe
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const FederalDashboard = () => {
  const stats = [
    { label: "Active Super Admins", value: "12", icon: Users, trend: "Regional", color: "blue" },
    { label: "Total Owners", value: "84", icon: UserPlus, trend: "Verified", color: "emerald" },
    { label: "Fuel Deliveries", value: "312", icon: Truck, trend: "+24 this week", color: "amber" },
    { label: "System Health", value: "Optimal", icon: ShieldCheck, trend: "Secure", color: "blue" },
  ];

  const recentDeliveries = [
    { id: 1, destination: "Addis Station A", volume: "20,000L", status: "PENDING", time: "10 mins ago" },
    { id: 2, destination: "Nazreth Hub", volume: "15,000L", status: "SUPERADMIN_ACCEPTED", time: "1 hour ago" },
    { id: 3, destination: "Bahir Dar Central", volume: "10,000L", status: "OWNER_ACCEPTED", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Federal Command Center</h2>
        <p className="text-muted-foreground">
          National Fuel Distribution & Administrative Oversight
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>
              Fuel quota distribution across regions.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-dashed border-muted mt-4">
            <div className="text-center space-y-2">
              <Globe className="h-12 w-12 text-muted-foreground/20 mx-auto" />
              <p className="text-sm text-muted-foreground italic">Regional mapping visualization pending data...</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>
              Latest fuel dispatch records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentDeliveries.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    item.status === 'OWNER_ACCEPTED' ? "bg-emerald-500" : 
                    item.status === 'SUPERADMIN_ACCEPTED' ? "bg-blue-500" : "bg-amber-500"
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.destination}</p>
                    <p className="text-xs text-muted-foreground">{item.volume} • {item.time}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0">
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-xs" size="sm">
              View All Deliveries
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FederalDashboard;
