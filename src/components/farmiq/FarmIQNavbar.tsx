import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Sun, 
  Moon, 
  Globe, 
  ChevronDown,
  UserCircle,
  History,
  Info,
  LogOut 
} from "lucide-react";

interface FarmIQNavbarProps {
  theme: 'light' | 'dark';
  language: 'English' | 'Hindi' | 'Punjabi';
  onThemeToggle: () => void;
  onLanguageChange: (lang: 'English' | 'Hindi' | 'Punjabi') => void;
}

export function FarmIQNavbar({ theme, language, onThemeToggle, onLanguageChange }: FarmIQNavbarProps) {
  const [activeLink, setActiveLink] = useState<string>('');
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Soil', href: '/soil-analysis' },
    { label: 'Crop', href: '/farmer/crop-disease' },
    { label: 'Market', href: '/market-prices' },
    { label: 'IoT', href: '#iot' },
  ];

  const languages = ['English', 'Hindi', 'Punjabi'] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">FarmIQ</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setActiveLink(link.href);
                  if (link.href.startsWith('/')) {
                    navigate(link.href);
                  }
                }}
                className={`relative text-foreground hover:text-primary transition-smooth font-medium ${
                  activeLink === link.href ? 'text-primary' : ''
                } after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border shadow-medium">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    {lang}
                    {language === lang && <span className="ml-2 text-primary">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0" 
              onClick={onThemeToggle}
            >
              {theme === 'light' ? 
                <Moon className="h-4 w-4" /> : 
                <Sun className="h-4 w-4" />
              }
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-medium">
                <DropdownMenuItem className="cursor-pointer hover:bg-muted py-3">
                  <UserCircle className="mr-3 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-muted py-3"
                  onClick={() => navigate('/yield-prediction')}
                >
                  <History className="mr-3 h-4 w-4" />
                  Crop history
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-muted py-3"
                  onClick={() => navigate('/farmer/teaching')}
                >
                  <Info className="mr-3 h-4 w-4" />
                  Know about the website
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-muted py-3 text-destructive">
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}