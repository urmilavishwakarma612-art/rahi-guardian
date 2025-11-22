import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingSOS } from "@/components/FloatingSOS";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, MapPin, Heart, Shield, Clock, Phone, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-highway.jpg";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingSOS />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-glow opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-glow opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block animate-scale-in">
                <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full backdrop-blur-sm border border-primary/20">
                  {t('home.badge')}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
                {t('home.title')}{" "}
                <span className="gradient-text animate-glow">{t('home.titleHighlight')}</span>
              </h1>
              <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/emergency">
                  <Button variant="emergency" size="lg" className="w-full sm:w-auto gap-2 hover-lift animate-glow">
                    <AlertTriangle className="h-5 w-5" />
                    {t('home.reportEmergency')}
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto gap-2 hover-lift">
                    <Shield className="h-5 w-5" />
                    View Buildathon Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="hover-scale cursor-default">
                  <div className="text-3xl font-bold gradient-text">10K+</div>
                  <div className="text-sm text-muted-foreground">{t('home.livesSaved')}</div>
                </div>
                <div className="hover-scale cursor-default">
                  <div className="text-3xl font-bold gradient-text">500+</div>
                  <div className="text-sm text-muted-foreground">{t('home.volunteers')}</div>
                </div>
                <div className="hover-scale cursor-default">
                  <div className="text-3xl font-bold gradient-text">&lt;2 min</div>
                  <div className="text-sm text-muted-foreground">{t('home.responseTime')}</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-2xl" />
              <img 
                src={heroImage} 
                alt="Highway safety and emergency response" 
                className="rounded-2xl shadow-glow w-full relative z-10 hover-lift"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-2xl z-20" />
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
                description: "Press SOS and speak naturally. Our AI understands your emergency.",
                delay: "0s"
              },
              {
                icon: Zap,
                step: "2",
                title: "AI Analysis",
                description: "Severity detection, location extraction, and emergency classification.",
                delay: "0.1s"
              },
              {
                icon: Users,
                step: "3",
                title: "Alert Network",
                description: "Nearby volunteers, authorities, and emergency contacts notified instantly.",
                delay: "0.2s"
              },
              {
                icon: Heart,
                step: "4",
                title: "Help Arrives",
                description: "First responders dispatched with real-time navigation and guidance.",
                delay: "0.3s"
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="p-6 relative overflow-hidden group hover-lift animate-fade-in border-primary/10"
                style={{ animationDelay: item.delay }}
              >
                <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 -mr-4 -mt-4 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow transition-all">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
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
              <Card 
                key={index} 
                className="p-6 hover-lift group border-primary/10 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Every Second Counts in an Emergency
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who trust RAHI for highway safety. Install the app to work offline during emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/install">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 hover-lift shadow-strong">
                  <Shield className="h-5 w-5" />
                  Install Offline App
                </Button>
              </Link>
              <Link to="/emergency">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-lift">
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
