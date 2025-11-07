import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock, AlertTriangle, Navigation, CheckCircle, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { MapView, calculateDistance } from "@/components/MapView";
import { reverseGeocode } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

const Volunteer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("Detecting location...");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check authentication and authorization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          toast.error("Please sign in as a volunteer or authority to access this page");
          navigate("/auth");
          return;
        }
        
        // Check if user has volunteer or authority role
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.id)
          .single();
        
        if (error || !roleData) {
          toast.error("Unable to verify your role");
          navigate("/auth");
          return;
        }
        
        if (roleData.role !== 'volunteer' && roleData.role !== 'authority' && roleData.role !== 'admin') {
          toast.error("This page is only for volunteers and authorities");
          navigate("/");
          return;
        }
        
        setUser(currentUser);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/auth");
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  // Fetch incidents from database
  useEffect(() => {
    if (!isAuthorized) return;
    
    const fetchIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setIncidents(data || []);
      } catch (error: any) {
        console.error('Error fetching incidents:', error);
        toast.error("Failed to load incidents");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('incidents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents',
        },
        () => {
          fetchIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized]);

  useEffect(() => {
    if (!isAuthorized) return;
    
    if ("geolocation" in navigator) {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };

      const onSuccess = async (position: GeolocationPosition) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setAccuracy(acc);
        console.log("Geolocation fix (Volunteer):", { latitude, longitude, accuracy: acc, timestamp: position.timestamp });
        
        // Fetch address from coordinates
        const fetchedAddress = await reverseGeocode(latitude, longitude);
        setAddress(fetchedAddress);
      };

      const onError = (error: GeolocationPositionError) => {
        console.error("Geolocation error (Volunteer):", error);
      };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isAuthorized]);

  const calculateDistanceFromUser = (lat: number, lng: number) => {
    if (!userLocation) return null;
    return calculateDistance(
      { lat: userLocation.lat, lng: userLocation.lng },
      { lat, lng }
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };
  
  const handleRespond = async (incidentId: string) => {
    try {
      // Update incident status
      const { error } = await supabase
        .from('incidents')
        .update({ status: 'in_progress' })
        .eq('id', incidentId);

      if (error) throw error;

      toast.success("Responding to incident! Navigation starting...");
      
      // Request notification permission if not granted
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch (error: any) {
      console.error('Error responding to incident:', error);
      toast.error("Failed to respond to incident");
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-emergency text-emergency-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };
  
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-hero rounded-lg">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Volunteer Dashboard</h1>
                  <p className="text-muted-foreground">Active incidents in your area</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Incidents</p>
                    <p className="text-2xl font-bold text-emergency">{incidents.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-emergency" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Responses</p>
                    <p className="text-2xl font-bold text-primary">24</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold text-primary">3.2 min</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lives Saved</p>
                    <p className="text-2xl font-bold text-success">18</p>
                  </div>
                  <Heart className="h-8 w-8 text-success" />
                </div>
              </Card>
            </div>
          </div>
          
          {/* Map View */}
          <Card className="p-0 overflow-hidden mb-8">
            <MapView
              incidents={incidents.map(inc => ({
                id: inc.id,
                location: { lat: inc.location_lat, lng: inc.location_lng },
                severity: inc.severity,
                description: inc.description || 'No description',
              }))}
              userLocation={userLocation || undefined}
              className="h-[500px] rounded-lg"
            />
            <div className="p-3 border-t text-xs space-y-1">
              {userLocation ? (
                <>
                  <p className="font-medium text-foreground">{address}</p>
                  <p className="text-muted-foreground">
                    GPS accuracy ~{accuracy ? Math.round(accuracy) : "?"} m • Lat {userLocation.lat.toFixed(4)}, Lng {userLocation.lng.toFixed(4)}
                  </p>
                </>
              ) : (
                <span className="text-muted-foreground">Detecting your live location...</span>
              )}
            </div>
          </Card>

          {/* Incident List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Nearby Emergencies</h2>
              <Badge variant="secondary" className="text-sm">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse mr-2" />
                Live Updates
              </Badge>
            </div>
            
            {loading ? (
              <Card className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading incidents...</p>
              </Card>
            ) : incidents.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                <h3 className="text-xl font-semibold mb-2">No Active Emergencies</h3>
                <p className="text-muted-foreground">Great! There are no pending emergencies in your area right now.</p>
              </Card>
            ) : (
              incidents.map((incident) => {
                const distance = calculateDistanceFromUser(incident.location_lat, incident.location_lng);
                return (
                <Card key={incident.id} className="p-6 hover:shadow-soft transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity.toUpperCase()}
                        </Badge>
                        {incident.status === "in_progress" && (
                          <Badge variant="outline" className="border-primary text-primary">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{incident.description || 'Emergency reported'}</h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>Lat: {incident.location_lat.toFixed(4)}, Lng: {incident.location_lng.toFixed(4)}</span>
                        </div>
                        {distance && (
                          <div className="flex items-center gap-1">
                            <Navigation className="h-4 w-4" />
                            <span>{distance.toFixed(1)} km away</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(incident.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {incident.status === "pending" ? (
                        <>
                          <Button
                            onClick={() => handleRespond(incident.id)}
                            variant="emergency"
                            className="gap-2"
                          >
                            <Heart className="h-4 w-4" />
                            Respond to Emergency
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" disabled>
                          Already Responding
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
            )}
          </div>
          
          {/* Become a Volunteer CTA */}
          <Card className="mt-8 p-8 bg-gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative text-primary-foreground">
              <h2 className="text-2xl font-bold mb-4">Want to Save Lives?</h2>
              <p className="mb-6 opacity-90">
                Join our network of certified first responders. Get training, certification, and 
                be part of a community that makes a real difference on the highways.
              </p>
              <Button variant="secondary" size="lg" className="gap-2">
                <Heart className="h-5 w-5" />
                Apply to Become a Volunteer
              </Button>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Volunteer;
