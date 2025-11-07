import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { AlertTriangle, Heart, Shield, Menu, X } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/volunteer", label: "Volunteers" },
    { to: "/first-aid", label: "First Aid" },
    { to: "/about", label: "About" },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">RAHI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.to) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Desktop Actions */}
            <Link to="/emergency" className="hidden md:block">
              <Button variant="emergency" size="lg" className="gap-2">
                <AlertTriangle className="h-5 w-5" />
                SOS Emergency
              </Button>
            </Link>
            <Link to="/auth" className="hidden md:block">
              <Button variant="outline">Sign In</Button>
            </Link>

            {/* Mobile Emergency Button - Always Visible */}
            <Link to="/emergency" className="md:hidden">
              <Button variant="emergency" size="sm" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                SOS
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl bg-gradient-hero bg-clip-text text-transparent">
                      RAHI
                    </span>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary p-2 rounded-lg ${
                          isActive(link.to)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                    <Link to="/emergency" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="emergency" size="lg" className="w-full gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Report Emergency
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="lg" className="w-full">
                        Sign In
                      </Button>
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
