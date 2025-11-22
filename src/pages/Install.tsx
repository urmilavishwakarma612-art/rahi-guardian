import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Wifi, WifiOff, MapPin, Phone, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      toast.success('RAHI installed successfully! 🎉');
    });

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Installation not available. Try using Chrome or Edge browser.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Installing RAHI...');
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Download className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Install RAHI App</h1>
            <p className="text-xl text-muted-foreground">
              Access emergency services even without internet
            </p>
            
            {/* Online/Offline Status */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Offline Mode Active</span>
                </>
              )}
            </div>
          </div>

          {/* Install Button */}
          {isInstalled ? (
            <Card className="mb-8 border-green-600">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">App Already Installed!</p>
                    <p className="text-sm text-muted-foreground">RAHI is ready to use offline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardContent className="pt-6">
                {deferredPrompt ? (
                  <div className="text-center space-y-4">
                    <Smartphone className="h-16 w-16 mx-auto text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ready to Install</h3>
                      <p className="text-muted-foreground mb-4">
                        Install RAHI on your device for instant access during emergencies
                      </p>
                    </div>
                    <Button size="lg" onClick={handleInstallClick} className="gap-2">
                      <Download className="h-5 w-5" />
                      Install RAHI Now
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      To install RAHI on your device:
                    </p>
                    <div className="text-left space-y-2 max-w-md mx-auto">
                      <p className="text-sm">📱 <strong>On iPhone:</strong> Tap Share → Add to Home Screen</p>
                      <p className="text-sm">🤖 <strong>On Android:</strong> Tap Menu (⋮) → Install App</p>
                      <p className="text-sm">💻 <strong>On Desktop:</strong> Click install icon in address bar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Offline Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Emergency Numbers
                </CardTitle>
                <CardDescription>
                  Always accessible offline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ 108 - Ambulance</li>
                  <li>✓ 100 - Police</li>
                  <li>✓ 101 - Fire Brigade</li>
                  <li>✓ 1033 - Highway Emergency</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  First Aid Guide
                </CardTitle>
                <CardDescription>
                  Complete offline access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ CPR Instructions</li>
                  <li>✓ Bleeding Control</li>
                  <li>✓ Fracture Management</li>
                  <li>✓ Burns Treatment</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Services
                </CardTitle>
                <CardDescription>
                  Works without internet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ GPS Location Detection</li>
                  <li>✓ Cached Map Tiles</li>
                  <li>✓ Nearby Services</li>
                  <li>✓ Volunteer Matching</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  App Features
                </CardTitle>
                <CardDescription>
                  Full functionality offline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Voice Recording</li>
                  <li>✓ Incident Reporting</li>
                  <li>✓ Push Notifications</li>
                  <li>✓ Auto-sync when online</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Why Install RAHI?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Instant Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Launch RAHI directly from your home screen - no need to open browser
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Works Offline</h4>
                    <p className="text-sm text-muted-foreground">
                      Access emergency numbers, first-aid guides, and report incidents without internet
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Fast & Lightweight</h4>
                    <p className="text-sm text-muted-foreground">
                      Takes minimal space and loads instantly - perfect for emergencies
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Auto Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Always get the latest features and improvements automatically
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Install;
