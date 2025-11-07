import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, AlertTriangle, Flame, Activity, Wind, Phone, Clock, Info } from "lucide-react";
import { useState } from "react";

const FirstAid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = [
    {
      id: "accident",
      title: "Road Accidents",
      icon: AlertTriangle,
      color: "text-emergency",
      guides: [
        {
          title: "Vehicle Collision Response",
          steps: [
            "Ensure your own safety first - park safely away from traffic",
            "Call emergency services immediately (911)",
            "Do not move injured persons unless there's immediate danger",
            "Check for breathing and pulse if safe to approach",
            "Apply pressure to any bleeding wounds with clean cloth",
            "Keep the person warm and calm until help arrives",
          ],
        },
        {
          title: "Motorcycle Accident",
          steps: [
            "Do NOT remove the helmet unless absolutely necessary",
            "Call 911 immediately",
            "Keep the person still to prevent spinal injury",
            "Cover with blanket to prevent shock",
            "Monitor breathing and consciousness",
          ],
        },
      ],
    },
    {
      id: "medical",
      title: "Medical Emergencies",
      icon: Activity,
      color: "text-warning",
      guides: [
        {
          title: "Heart Attack",
          steps: [
            "Call 911 immediately",
            "Help the person sit down and rest",
            "Loosen tight clothing",
            "If they have prescribed medication (nitroglycerin), help them take it",
            "If unconscious and not breathing, begin CPR",
            "Stay with them until help arrives",
          ],
        },
        {
          title: "Stroke Recognition (FAST)",
          steps: [
            "Face: Ask to smile - is one side drooping?",
            "Arms: Ask to raise both arms - does one drift down?",
            "Speech: Ask to repeat a phrase - is speech slurred?",
            "Time: If yes to any, call 911 immediately",
            "Note the time symptoms started",
          ],
        },
        {
          title: "Severe Bleeding",
          steps: [
            "Apply direct pressure with clean cloth",
            "Maintain pressure for 10-15 minutes",
            "Do not remove cloth if blood soaks through - add more layers",
            "Elevate the wound above heart level if possible",
            "Call 911 for severe bleeding",
          ],
        },
      ],
    },
    {
      id: "fire",
      title: "Fire & Burns",
      icon: Flame,
      color: "text-emergency",
      guides: [
        {
          title: "Vehicle Fire",
          steps: [
            "Get everyone out of the vehicle immediately",
            "Move at least 100 feet away",
            "Call 911",
            "Do NOT attempt to fight the fire yourself",
            "Warn other drivers to stay clear",
          ],
        },
        {
          title: "Burn Treatment",
          steps: [
            "Remove from heat source immediately",
            "Cool the burn with running water for 10-20 minutes",
            "Remove jewelry and tight clothing before swelling",
            "Cover with sterile, non-adhesive bandage",
            "Do NOT apply ice, butter, or ointments",
            "Seek medical help for severe burns",
          ],
        },
      ],
    },
    {
      id: "breathing",
      title: "Breathing Issues",
      icon: Wind,
      color: "text-primary",
      guides: [
        {
          title: "Choking Adult",
          steps: [
            "Ask 'Are you choking?' - if they can't speak, begin first aid",
            "Stand behind them and make a fist above the navel",
            "Grasp fist with other hand and give quick upward thrusts",
            "Repeat until object is expelled",
            "Call 911 if unsuccessful or if person becomes unconscious",
          ],
        },
        {
          title: "CPR - Adult",
          steps: [
            "Call 911 or have someone else call",
            "Place person on firm, flat surface",
            "Kneel beside them and place heel of hand on center of chest",
            "Place other hand on top, interlock fingers",
            "Push hard and fast - at least 2 inches deep, 100-120 per minute",
            "After 30 compressions, give 2 rescue breaths",
            "Continue until help arrives or person starts breathing",
          ],
        },
      ],
    },
  ];
  
  const filteredCategories = categories.map(category => ({
    ...category,
    guides: category.guides.filter(guide =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.guides.length > 0);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full mb-4">
              <Heart className="h-5 w-5" />
              <span className="font-semibold">First Aid Knowledge Center</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Emergency First Aid Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Life-saving instructions for common highway emergencies. 
              These guides are for reference only - always call emergency services.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="emergency" size="lg" className="gap-2">
                <Phone className="h-5 w-5" />
                Call 911 Now
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Info className="h-5 w-5" />
                Safety Tips
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search first aid guides..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Categories */}
          <Tabs defaultValue="accident" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="gap-2">
                    <Icon className={`h-4 w-4 ${category.color}`} />
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {filteredCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                {category.guides.map((guide, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${category.color.replace('text-', 'bg-')}`} />
                      {guide.title}
                    </h3>
                    <ol className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                            {stepIndex + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
          
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6 bg-emergency/10 border-emergency/20">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-emergency flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-3 text-emergency">Emergency Contacts</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">General Emergency</span>
                      <Badge variant="destructive" className="text-base">911</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Poison Control</span>
                      <Badge variant="outline">1-800-222-1222</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Mental Health Crisis</span>
                      <Badge variant="outline">988</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/10 border-primary/20">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Advanced Features</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Detailed first-aid video tutorials <Badge variant="secondary" className="ml-2">Coming Soon</Badge></p>
                    <p>• Interactive CPR training <Badge variant="secondary" className="ml-2">Coming Soon</Badge></p>
                    <p>• Voice-guided emergency assistance <Badge variant="secondary" className="ml-2">Coming Soon</Badge></p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              This guide is for informational purposes only and does not replace professional medical advice. 
              Always call emergency services for serious medical situations.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FirstAid;
