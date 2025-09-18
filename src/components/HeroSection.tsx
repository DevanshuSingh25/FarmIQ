import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Phone } from "lucide-react";

interface HeroSectionProps {
  backgroundImage: string;
  badge?: string;
  title: string;
  description: string;
  primaryAction: {
    text: string;
    icon?: React.ComponentType<any>;
  };
  secondaryAction: {
    text: string;
    icon?: React.ComponentType<any>;
  };
}

export const HeroSection = ({
  backgroundImage,
  badge,
  title,
  description,
  primaryAction,
  secondaryAction
}: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-3xl">
          {badge && (
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              {badge}
            </Badge>
          )}
          <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
            {title}
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              {primaryAction.icon && <primaryAction.icon className="mr-2 h-5 w-5" />}
              {primaryAction.text}
            </Button>
            <Button variant="outline" size="lg" className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium h-11 rounded-md text-lg px-8 py-6">
              {secondaryAction.icon && <secondaryAction.icon className="mr-2 h-5 w-5" />}
              {secondaryAction.text}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};