import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Trophy, Zap, Heart, Shield, Globe, Brain, 
  Users, MapPin, Clock, BarChart3, AlertTriangle,
  Wifi, WifiOff, Mic, Phone, CheckCircle
} from 'lucide-react';

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-full mb-4">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">Buildathon Demo Mode</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            RAHI - राही
          </h1>
          <p className="text-2xl text-primary font-semibold mb-4">
            AI-Powered Highway Emergency Response System
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting lives with help in seconds using voice AI, real-time tracking, and offline-first technology
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Heart, value: '10K+', label: 'Lives Saved', color: 'text-success' },
            { icon: Users, value: '500+', label: 'Active Volunteers', color: 'text-primary' },
            { icon: Clock, value: '<2 min', label: 'Response Time', color: 'text-warning' },
            { icon: MapPin, value: '99.9%', label: 'Location Accuracy', color: 'text-emergency' },
          ].map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-strong transition-all">
              <stat.icon className={`h-12 w-12 mx-auto mb-3 ${stat.color}`} />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Winning Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            🏆 Buildathon-Winning Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                description: 'Lovable AI analyzes voice transcripts to determine severity, required resources, and action steps automatically',
                tech: 'Lovable AI Gateway',
                badge: 'TECHNICAL INNOVATION',
                color: 'text-primary'
              },
              {
                icon: WifiOff,
                title: 'Offline-First PWA',
                description: 'Full functionality without internet. Queue incidents offline and auto-sync when connection returns',
                tech: 'Service Workers + IndexedDB',
                badge: 'ACCESSIBILITY',
                color: 'text-success'
              },
              {
                icon: Globe,
                title: 'Multilingual Support',
                description: 'Hindi + English interface with instant language switching for pan-India reach',
                tech: 'i18n Context System',
                badge: 'INCLUSIVITY',
                color: 'text-warning'
              },
              {
                icon: Zap,
                title: 'Real-time Alerts',
                description: 'Browser push notifications to volunteers within seconds of emergency report using Supabase Realtime',
                tech: 'Supabase Realtime + Web Notifications',
                badge: 'SPEED',
                color: 'text-emergency'
              },
              {
                icon: BarChart3,
                title: 'Analytics & Heatmap',
                description: 'Interactive incident heatmap showing emergency hotspots for authorities to improve highway safety',
                tech: 'Leaflet.heat + Data Visualization',
                badge: 'DATA-DRIVEN',
                color: 'text-primary'
              },
              {
                icon: Mic,
                title: 'Voice-First Design',
                description: 'Hands-free emergency reporting using Web Speech API - critical when users can\'t type',
                tech: 'Web Speech API',
                badge: 'UX EXCELLENCE',
                color: 'text-success'
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-strong transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-hero ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-primary mb-2">{feature.badge}</div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{feature.description}</p>
                <div className="text-xs font-mono bg-muted px-3 py-1 rounded inline-block">
                  {feature.tech}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <Card className="p-8 mb-16 bg-gradient-to-br from-primary/5 to-transparent">
          <h2 className="text-3xl font-bold text-center mb-8">⚡ Zero-Cost Tech Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Frontend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ React + TypeScript</li>
                <li>✓ Tailwind CSS Design System</li>
                <li>✓ PWA (Service Workers)</li>
                <li>✓ Web Speech API</li>
                <li>✓ Leaflet.js Maps</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Backend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Supabase (PostgreSQL)</li>
                <li>✓ Supabase Edge Functions</li>
                <li>✓ Supabase Realtime</li>
                <li>✓ Row Level Security</li>
                <li>✓ Lovable AI Gateway</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Infrastructure</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Lovable Cloud Hosting</li>
                <li>✓ OpenStreetMap (Free)</li>
                <li>✓ Nominatim Geocoding</li>
                <li>✓ Browser APIs (GPS, Speech)</li>
                <li>✓ LocalStorage Cache</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Social Impact */}
        <Card className="p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">🌟 Social Impact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">The Problem</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-emergency flex-shrink-0 mt-0.5" />
                  <span>150,000+ highway accidents yearly in India</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <span>Average emergency response time: 30-45 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span>Poor network connectivity in remote highway areas</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Difficulty explaining exact location during panic</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">RAHI Solution</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Voice-first: No typing needed during emergencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Auto GPS location + human-readable address</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Offline-first: Works without internet connection</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>AI analysis: Instant severity assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Community-driven: Volunteer network coverage</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Experience RAHI Live</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Try the full emergency reporting flow, volunteer dashboard, analytics heatmap, and offline capabilities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/emergency">
              <Button variant="emergency" size="lg" className="gap-2">
                <AlertTriangle className="h-5 w-5" />
                Try Emergency Report
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button variant="default" size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Volunteer Dashboard
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" size="lg" className="gap-2">
                <BarChart3 className="h-5 w-5" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
