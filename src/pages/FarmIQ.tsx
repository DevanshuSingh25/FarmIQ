import { useState } from "react";
import { FarmIQNavbar } from "@/components/farmiq/FarmIQNavbar";
import { WeatherCard } from "@/components/farmiq/WeatherCard";
import { ActionButtons } from "@/components/farmiq/ActionButtons";
import { FarmIQFooter } from "@/components/farmiq/FarmIQFooter";
import { SectionSpeaker } from "@/components/ui/section-speaker";

export default function FarmIQ() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <FarmIQNavbar 
        theme={theme}
        language={language}
        onThemeToggle={toggleTheme}
        onLanguageChange={setLanguage}
      />
      
      <main className="pt-16 pb-4 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Weather Card */}
          <div className="mb-8 relative">
            <div className="absolute top-2 right-2 z-10">
              <SectionSpeaker 
                getText={() => "Today's weather is 18 degrees celsius with cloudy conditions. Humidity is good at 65%, soil moisture is low at 35%, and there's light precipitation expected."}
                sectionId="weather-card"
                ariaLabel="Read weather information"
                alwaysVisible
              />
            </div>
            <WeatherCard />
          </div>
          
          {/* Action Buttons */}
          <div className="relative">
            <ActionButtons />
          </div>
        </div>
      </main>
      
      <FarmIQFooter />
    </div>
  );
}