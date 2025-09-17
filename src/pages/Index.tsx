import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Sprout, 
  CloudRain, 
  TrendingUp, 
  Camera, 
  MessageCircle, 
  Mic, 
  QrCode,
  DollarSign,
  Shield,
  Users,
  ChevronRight,
  Phone,
  PlayCircle
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { StatsCard } from "@/components/StatsCard";
import { HeroSection } from "@/components/HeroSection";
import heroImage from "@/assets/hero-farmers-tech.jpg";
import dashboardMockup from "@/assets/app-dashboard-mockup.jpg";
import soilAnalysisScreen from "@/assets/soil-analysis-screen.jpg";
import diseaseDetectionScreen from "@/assets/disease-detection-screen.jpg";
import weatherDashboardScreen from "@/assets/weather-dashboard-screen.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Sprout,
      title: "Soil Analysis",
      description: "Get detailed soil health reports and personalized fertilizer recommendations based on your field conditions",
      color: "success"
    },
    {
      icon: TrendingUp,
      title: "Yield Prediction",
      description: "Time series analysis to predict crop yields and optimize farming decisions for maximum profitability",
      color: "accent"
    },
    {
      icon: QrCode,
      title: "Blockchain Tracking",
      description: "QR-based supply chain transparency and product traceability from farm to market",
      color: "primary"
    },
    {
      icon: Camera,
      title: "Disease Detection",
      description: "AI-powered crop disease identification through photo analysis with instant treatment recommendations",
      color: "warning"
    },
    {
      icon: DollarSign,
      title: "Market Intelligence",
      description: "Real-time market prices, demand forecasts, and optimal selling strategies for your crops",
      color: "success"
    },
    {
      icon: CloudRain,
      title: "Weather Insights",
      description: "Hyperlocal weather forecasts, irrigation alerts, and climate-based farming guidance",
      color: "primary"
    },
    {
      icon: Mic,
      title: "Voice Support",
      description: "Multilingual voice commands and audio responses for farmers with limited digital literacy",
      color: "accent"
    },
    {
      icon: MessageCircle,
      title: "AI Chatbot",
      description: "24/7 intelligent assistant providing instant answers to all your farming questions",
      color: "warning"
    }
  ];

  const stats = [
    { icon: Users, value: "86%", label: "Small & marginal farmers in India", trend: "up" as const },
    { icon: TrendingUp, value: "20-30%", label: "Yield increase with ICT advisory", trend: "up" as const },
    { icon: Shield, value: "50%", label: "Reduction in chemical overuse", trend: "up" as const },
    { icon: DollarSign, value: "₹15K", label: "Average cost savings per season", trend: "up" as const }
  ];

  const appScreens = [
    {
      title: "Soil Health Analysis",
      description: "Comprehensive soil testing and nutrient analysis with personalized fertilizer recommendations",
      image: soilAnalysisScreen,
      features: ["pH Level Monitoring", "Nutrient Deficiency Detection", "Custom Fertilizer Plans", "Soil Health Trends"]
    },
    {
      title: "Disease Detection",
      description: "AI-powered crop disease identification through image analysis with instant treatment solutions",
      image: diseaseDetectionScreen,
      features: ["Real-time Scanning", "95% Accuracy Rate", "Treatment Recommendations", "Prevention Tips"]
    },
    {
      title: "Weather Intelligence",
      description: "Hyperlocal weather forecasts and climate-based farming guidance for optimal crop management",
      image: weatherDashboardScreen,
      features: ["7-day Forecasts", "Irrigation Alerts", "Frost Warnings", "Rainfall Predictions"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroImage}
        badge="Empowering Small & Marginal Farmers"
        title="Smart Crop Advisory System"
        description="AI-powered agricultural guidance in your native language. Increase yields by 20-30% with personalized soil analysis, weather insights, and real-time crop advisory."
        primaryAction={{
          text: "Watch Demo",
          icon: PlayCircle
        }}
        secondaryAction={{
          text: "Download App",
          icon: Phone
        }}
      />

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                trend={stat.trend}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Comprehensive Farming Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make informed farming decisions in one intelligent platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color as "success" | "accent" | "primary" | "warning"}
                isActive={activeFeature === index}
                onClick={() => {
                  setActiveFeature(index);
                  if (feature.title === "Soil Analysis") {
                    navigate("/soil-analysis");
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* App Screens Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powerful Features in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how our AI-powered tools help farmers make smarter decisions every day
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {appScreens.map((screen, index) => (
              <div key={index} className="group">
                <div className="relative mb-6 overflow-hidden rounded-2xl shadow-medium group-hover:shadow-strong transition-smooth">
                  <img 
                    src={screen.image}
                    alt={screen.title}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth">
                  {screen.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {screen.description}
                </p>
                
                <div className="space-y-2">
                  {screen.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="lg" className="px-8 py-6 text-lg">
              Experience the Full App
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using smart technology to increase yields and reduce costs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              placeholder="Enter your mobile number"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button variant="secondary" className="px-8 whitespace-nowrap">
              Get Started
            </Button>
          </div>
          
          <p className="text-sm opacity-75 mt-4">
            Free for small and marginal farmers. No hidden charges.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;