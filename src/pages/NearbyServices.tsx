import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Hospital, Shield, Flame, Clock, Navigation } from "lucide-react";

const NearbyServices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Badge */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Nearby Emergency Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find hospitals, police stations, and fire departments near your location instantly.
            </p>
          </div>

          {/* Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-emergency/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hospital className="h-8 w-8 text-emergency" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Hospitals</h3>
              <p className="text-sm text-muted-foreground">
                Find nearest hospitals with emergency rooms and trauma centers
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Police Stations</h3>
              <p className="text-sm text-muted-foreground">
                Locate nearby police stations and highway patrol units
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fire Stations</h3>
              <p className="text-sm text-muted-foreground">
                Find fire departments ready to respond to emergencies
              </p>
            </Card>
          </div>

          {/* Feature List */}
          <Card className="p-8 bg-gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative text-primary-foreground">
              <h2 className="text-2xl font-bold mb-6">Upcoming Features</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Real-time Distance & Directions</p>
                    <p className="text-sm opacity-90">Get live distance updates and turn-by-turn navigation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">GPS-Based Location</p>
                    <p className="text-sm opacity-90">Automatically detect your location and show nearby services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Operating Hours</p>
                    <p className="text-sm opacity-90">Check which facilities are open 24/7 for emergencies</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              This feature is under development and will be available soon. 
              In emergencies, always call 911 immediately.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NearbyServices;
