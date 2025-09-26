import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Sun, 
  Droplets, 
  Thermometer, 
  Wind,
  Calendar 
} from "lucide-react";

export function WeatherCard() {
  const navigate = useNavigate();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card 
      className="p-6 bg-gradient-to-r from-accent/10 to-success/10 border-accent/20 shadow-medium hover:shadow-strong transition-all duration-300 cursor-pointer"
      onClick={() => navigate('/farmer/weather')}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left section - Date and Weather */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              {currentDate}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sun className="h-8 w-8 text-warning" />
                <span className="text-3xl font-bold text-foreground">18°C</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Cloudy</p>
                <p className="text-sm text-muted-foreground">Partly cloudy day</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2 p-3 bg-background/50 rounded-lg">
            <Droplets className="h-5 w-5 text-primary" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Humidity</p>
              <Badge variant="secondary" className="text-xs">Good</Badge>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 bg-background/50 rounded-lg">
            <Thermometer className="h-5 w-5 text-warning" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Soil Moisture</p>
              <Badge variant="destructive" className="text-xs">Low</Badge>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 bg-background/50 rounded-lg col-span-2 md:col-span-1">
            <Wind className="h-5 w-5 text-accent" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Precipitation</p>
              <Badge className="text-xs bg-success text-success-foreground">Good</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}