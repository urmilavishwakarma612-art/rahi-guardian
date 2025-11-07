import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Mail, MessageSquare, AlertTriangle, MapPin, Radio } from "lucide-react";

const Notifications = () => {
  const mockNotifications = [
    {
      icon: AlertTriangle,
      title: "Multi-vehicle accident on Highway 101",
      time: "2 minutes ago",
      type: "emergency",
    },
    {
      icon: MapPin,
      title: "New volunteer needed 3.2 km from your location",
      time: "15 minutes ago",
      type: "volunteer",
    },
    {
      icon: Radio,
      title: "Traffic update: Heavy congestion on I-5 South",
      time: "1 hour ago",
      type: "info",
    },
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
            <h1 className="text-4xl font-bold mb-4">Smart Notifications & Alerts</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed with real-time emergency alerts, volunteer requests, and traffic updates.
            </p>
          </div>

          {/* Preview Notifications */}
          <div className="space-y-4 mb-12">
            {mockNotifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <Card key={index} className="p-6 opacity-60">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${notification.type === 'emergency' ? 'emergency' : 'primary'}/10 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 text-${notification.type === 'emergency' ? 'emergency' : 'primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                    <Badge variant={notification.type === 'emergency' ? 'destructive' : 'secondary'}>
                      {notification.type}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Notification Types */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-emergency/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-emergency" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Instant alerts for nearby emergencies
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Detailed incident reports via email
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">SMS Updates</h3>
              <p className="text-sm text-muted-foreground">
                Text messages for critical updates
              </p>
            </Card>
          </div>

          {/* Features */}
          <Card className="p-8 bg-gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative text-primary-foreground">
              <h2 className="text-2xl font-bold mb-6">Upcoming Features</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Custom Alert Preferences</p>
                    <p className="text-sm opacity-90">Choose which types of emergencies you want to be notified about</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Location-Based Alerts</p>
                    <p className="text-sm opacity-90">Get notified only for incidents within your specified radius</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Radio className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Multi-Channel Delivery</p>
                    <p className="text-sm opacity-90">Receive alerts via push, email, and SMS based on urgency</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Quiet Hours</p>
                    <p className="text-sm opacity-90">Set times when you don't want to receive non-critical alerts</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Notification system is under development. Emergency alerts will be delivered through multiple channels for maximum reliability.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;
