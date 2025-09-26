import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Zap, 
  Wind, 
  CloudSnow, 
  Thermometer,
  Eye 
} from 'lucide-react';
import { DailyForecast, WeatherIcon } from '@/types/weather';

interface WeatherCardProps {
  forecast: DailyForecast;
  units: { temperature: 'C' | 'F'; wind: 'kph' | 'mph' };
  onViewHourly: () => void;
}

const weatherIcons: Record<WeatherIcon, React.ComponentType<{ className?: string }>> = {
  clear: Sun,
  rain: CloudRain,
  storm: Zap,
  cloud: Cloud,
  wind: Wind,
  fog: Cloud,
  snow: CloudSnow,
  heat: Thermometer
};

const confidenceColors = {
  High: 'bg-success text-success-foreground',
  Medium: 'bg-warning text-warning-foreground',
  Low: 'bg-destructive text-destructive-foreground'
};

export function WeatherCard({ forecast, units, onViewHourly }: WeatherCardProps) {
  const WeatherIcon = weatherIcons[forecast.icon];
  const date = new Date(forecast.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const convertTemp = (tempC: number) => {
    return units.temperature === 'F' ? Math.round((tempC * 9/5) + 32) : tempC;
  };
  
  const convertWind = (windKph: number) => {
    return units.wind === 'mph' ? Math.round(windKph * 0.621371) : windKph;
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-soft border hover:shadow-medium transition-smooth">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-foreground">{dayName}</h3>
            <p className="text-sm text-muted-foreground">{dayDate}</p>
          </div>
          <Badge 
            className={`text-xs ${confidenceColors[forecast.confidence]}`}
            variant="secondary"
          >
            {forecast.confidence}
          </Badge>
        </div>

        {/* Weather Icon and Summary */}
        <div className="flex items-center gap-3">
          <WeatherIcon className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{forecast.summary}</p>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {convertTemp(forecast.tempMaxC)}°
            </span>
            <span className="text-lg text-muted-foreground">
              {convertTemp(forecast.tempMinC)}°
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            °{units.temperature}
          </span>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CloudRain className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Rain:</span>
            <span className="font-medium text-foreground">{forecast.precipChance}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Wind:</span>
            <span className="font-medium text-foreground">
              {convertWind(forecast.windKph)} {units.wind}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Direction:</span>
            <span className="font-medium text-foreground">{forecast.windDir}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Humidity:</span>
            <span className="font-medium text-foreground">{forecast.humidityPct}%</span>
          </div>
        </div>

        {/* Alerts */}
        {forecast.alerts.length > 0 && (
          <div className="space-y-1">
            {forecast.alerts.map((alert, index) => (
              <Badge 
                key={index} 
                variant="destructive" 
                className="text-xs mr-1"
              >
                {alert.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        )}

        {/* View Hourly Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onViewHourly}
          className="w-full flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View hourly
        </Button>
      </div>
    </div>
  );
}