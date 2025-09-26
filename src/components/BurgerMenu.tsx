import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronRight, FlaskConical, Bug, CloudRain, TrendingUp, Cpu, Home } from "lucide-react";

export function BurgerMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: Home, to: "/" },
    { label: "Soil analysis", icon: FlaskConical, to: "/soil-analysis" },
    { label: "Crop disease", icon: Bug, to: "/farmer/crop-disease" },
    { label: "weather", icon: CloudRain, to: "/farmer/weather" },
    { label: "Market data", icon: TrendingUp, to: "/market-prices" },
    { label: "IoT", icon: Cpu, to: "/iot" }
  ];

  return (
    <div className="fixed top-4 left-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full shadow-medium">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Button
                  key={item.to}
                  variant={active ? "default" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => navigate(item.to)}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-60" />
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}


