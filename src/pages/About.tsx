import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Zap, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">About RAHI</h1>
            <p className="text-xl text-muted-foreground">
              Real-time Assistant for Highway Incidents
            </p>
          </div>
          
          {/* Mission */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  RAHI was born from a simple yet powerful vision: to ensure that no one faces a highway 
                  emergency alone. Every year, thousands of lives are lost on highways due to delayed emergency 
                  response, lack of immediate first aid, and communication barriers in critical moments.
                </p>
                <p className="text-muted-foreground">
                  We leverage cutting-edge AI technology, voice recognition, and a compassionate network of 
                  trained volunteers to provide immediate assistance when it matters most. Our platform connects 
                  those in need with help in seconds, not minutes.
                </p>
              </div>
            </div>
          </Card>
          
          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">What Makes RAHI Different</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced voice recognition and natural language processing understands your emergency, 
                  even in panic situations
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Community Network</h3>
                <p className="text-sm text-muted-foreground">
                  Certified volunteers and first responders in your area, ready to help within minutes
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Immediate Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time first aid instructions and support while help is on the way
                </p>
              </Card>
            </div>
          </div>
          
          {/* Impact */}
          <Card className="p-8 mb-8 bg-gradient-hero text-primary-foreground">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-sm opacity-90">Lives Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Active Volunteers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">&lt;2 min</div>
                <div className="text-sm opacity-90">Avg Response Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-90">Cities Covered</div>
              </div>
            </div>
          </Card>
          
          {/* Values */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Core Values</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Compassion First",
                  description: "Every interaction is handled with empathy and care, understanding that emergencies are stressful moments."
                },
                {
                  title: "Technology for Good",
                  description: "We harness AI and modern technology to serve humanity, not replace the human touch."
                },
                {
                  title: "Community Driven",
                  description: "Our strength comes from volunteers who dedicate their time and skills to help strangers in need."
                },
                {
                  title: "Privacy & Trust",
                  description: "Your data is encrypted and protected. We only use information to save lives, never for profit."
                },
              ].map((value, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Team */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground mb-6">
              RAHI is built by a passionate team of healthcare professionals, technologists, and 
              emergency responders who believe in a safer future for highway travel.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Together, we're building a world where help is always just seconds away.
            </p>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
