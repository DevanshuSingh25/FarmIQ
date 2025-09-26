import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { useNavigate } from "react-router-dom";
import { 
  Beaker, 
  Stethoscope, 
  TrendingUp, 
  HandHeart,
  ChevronRight
} from "lucide-react";

export function ActionButtons() {
  const navigate = useNavigate();
  
  const actions = [
    {
      id: 'soil',
      title: 'Soil analysis',
      description: 'Test soil health and get recommendations',
      icon: Beaker,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      route: '/soil-analysis'
    },
    {
      id: 'disease',
      title: 'Crop disease',
      description: 'Detect and prevent crop diseases',
      icon: Stethoscope,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      route: '/farmer/crop-disease'
    },
    {
      id: 'market',
      title: 'Market data',
      description: 'Get latest market prices and trends',
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      route: '/market-prices'
    },
    {
      id: 'ngo',
      title: 'NGO scheme',
      description: 'Access government schemes and support',
      icon: HandHeart,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      route: '/farmer/ngo-schemes'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action) => {
        const IconComponent = action.icon;
        
        return (
          <Card 
            key={action.id}
            className={`${action.bgColor} ${action.borderColor} border-2 hover:shadow-strong hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden`}
            onClick={() => navigate(action.route)}
          >
            <CardContent className="p-6 relative group">
              <div className="absolute top-2 right-2">
                <SectionSpeaker
                  sectionId={`action-${action.id}`}
                  getText={() => `${action.title}. ${action.description}`}
                  ariaLabel={`Listen to ${action.title} information`}
                  alwaysVisible={true}
                />
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full bg-gradient-to-br ${action.color} shadow-medium group-hover:shadow-strong transition-all`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(action.route);
                  }}
                >
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}