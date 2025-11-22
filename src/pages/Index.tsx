import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertTriangle, MapPin, Heart, Shield, Clock, Phone, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-highway.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  🚨 Real-time Emergency Response
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Guardian on the{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">Highway</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                RAHI uses AI-powered emergency detection to connect you with help in seconds. 
                Voice-activated reports, instant volunteer alerts, and real-time location tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/emergency">
                  <Button variant="emergency" size="lg" className="w-full sm:w-auto gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Report Emergency Now
                  </Button>
                </Link>
                <Link to="/install">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto gap-2">
                    <Shield className="h-5 w-5" />
                    Install App (Offline Mode)
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-6">
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Lives Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Active Volunteers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">&lt;2 min</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Highway safety and emergency response" 
                className="rounded-2xl shadow-strong w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How RAHI Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps between emergency and help
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: AlertTriangle,
                step: "1",
                title: "Report Incident",
                description: "Press SOS and speak naturally. Our AI understands your emergency."
              },
              {
                icon: Zap,
                step: "2",
                title: "AI Analysis",
                description: "Severity detection, location extraction, and emergency classification."
              },
              {
                icon: Users,
                step: "3",
                title: "Alert Network",
                description: "Nearby volunteers, authorities, and emergency contacts notified instantly."
              },
              {
                icon: Heart,
                step: "4",
                title: "Help Arrives",
                description: "First responders dispatched with real-time navigation and guidance."
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 relative overflow-hidden group hover:shadow-strong transition-all duration-300">
                <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 -mr-4 -mt-4">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose RAHI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets compassionate care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Auto Location Detection",
                description: "Pinpoint accuracy using GPS and highway markers. No need to explain where you are."
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Round-the-clock monitoring and instant response, every single day of the year."
              },
              {
                icon: Phone,
                title: "Voice-Activated SOS",
                description: "Speak naturally. Our AI understands context, emotions, and urgency levels."
              },
              {
                icon: Users,
                title: "Volunteer Network",
                description: "Certified first responders and medical professionals ready to help in your area."
              },
              {
                icon: Shield,
                title: "Privacy Protected",
                description: "Your data is encrypted and secure. We only share what's needed to save lives."
              },
              {
                icon: Heart,
                title: "First Aid Guidance",
                description: "Immediate life-saving instructions while help is on the way."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-soft transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Every Second Counts in an Emergency
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who trust RAHI for highway safety. Install the app to work offline during emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/install">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                  <Shield className="h-5 w-5" />
                  Install Offline App
                </Button>
              </Link>
              <Link to="/emergency">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Try Emergency Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
