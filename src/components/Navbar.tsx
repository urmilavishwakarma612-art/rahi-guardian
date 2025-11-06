import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertTriangle, Heart, Shield } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();
  
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
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/emergency">
              <Button variant="emergency" size="lg" className="gap-2">
                <AlertTriangle className="h-5 w-5" />
                SOS Emergency
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
