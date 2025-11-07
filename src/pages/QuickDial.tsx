import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Clock, AlertTriangle, Heart, Shield, Flame, Users } from "lucide-react";

const QuickDial = () => {
  const mockNumbers = [
    { icon: AlertTriangle, label: "Emergency Services", number: "911", color: "emergency" },
    { icon: Shield, label: "Highway Patrol", number: "1-800-XXX-XXXX", color: "primary" },
    { icon: Heart, label: "Poison Control", number: "1-800-222-1222", color: "success" },
    { icon: Flame, label: "Fire Department", number: "1-800-XXX-XXXX", color: "warning" },
    { icon: Users, label: "Mental Health Crisis", number: "988", color: "primary" },
  ];

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
            <h1 className="text-4xl font-bold mb-4">Quick Dial Emergency Contacts</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One-tap access to emergency numbers. Save precious seconds when every moment counts.
            </p>
          </div>

          {/* Preview Emergency Numbers */}
          <div className="space-y-4 mb-12">
            {mockNumbers.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Card key={index} className="p-6 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-${contact.color}/10 rounded-full flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 text-${contact.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{contact.label}</h3>
                        <p className="text-2xl font-bold text-primary">{contact.number}</p>
                      </div>
                    </div>
                    <Button variant="outline" disabled className="gap-2">
                      <Phone className="h-5 w-5" />
                      Call Now
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Features */}
          <Card className="p-8 bg-gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative text-primary-foreground">
              <h2 className="text-2xl font-bold mb-6">Upcoming Features</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">One-Tap Direct Calling</p>
                    <p className="text-sm opacity-90">Instantly call emergency services with a single tap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Custom Emergency Contacts</p>
                    <p className="text-sm opacity-90">Add personal emergency contacts and family members</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Automatic Location Sharing</p>
                    <p className="text-sm opacity-90">Share your GPS coordinates automatically when calling</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Note */}
          <Card className="mt-8 p-6 bg-emergency/10 border-emergency/20">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-emergency flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-emergency">Important</h3>
                <p className="text-sm text-muted-foreground">
                  This feature is in development. For immediate emergencies, 
                  use your phone's dialer to call <strong>911</strong> directly.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuickDial;
