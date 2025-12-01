import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Shield, Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">RAHI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/volunteer" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/volunteer") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Volunteers
            </Link>
            <Link 
              to="/first-aid" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/first-aid") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              First Aid
            </Link>
            <Link
              to="/nearby-services" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/nearby-services") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Nearby Services
            </Link>
            <Link 
              to="/quick-dial" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/quick-dial") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Quick Dial
            </Link>
            <Link 
              to="/notifications" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/notifications") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Notifications
            </Link>
            <Link 
              to="/analytics" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/analytics") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Analytics
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link to="/emergency" className="hidden sm:block">
              <Button variant="emergency" size="lg" className="gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="hidden md:inline">{t('nav.sos')}</span>
                <span className="md:hidden">SOS</span>
              </Button>
            </Link>
            <Link to="/auth" className="hidden sm:block">
              <Button variant="outline">{t('nav.signIn')}</Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <Link 
                    to="/" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/volunteer" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/volunteer") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Volunteers
                  </Link>
                  <Link 
                    to="/first-aid" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/first-aid") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    First Aid
                  </Link>
                  <Link
                    to="/nearby-services" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/nearby-services") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Nearby Services
                  </Link>
                  <Link 
                    to="/quick-dial" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/quick-dial") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Quick Dial
                  </Link>
                  <Link 
                    to="/notifications" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/notifications") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Notifications
                  </Link>
                  <Link 
                    to="/analytics" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/analytics") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Analytics
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive("/about") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    About
                  </Link>
                  
                  <div className="border-t pt-6 space-y-3">
                    <Link to="/emergency" onClick={() => setIsOpen(false)}>
                      <Button variant="emergency" className="w-full gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        SOS Emergency
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
