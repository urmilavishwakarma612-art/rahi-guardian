import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MapPin, Clock, AlertTriangle, Navigation, CheckCircle, Loader2, LogOut, Car, Stethoscope } from "lucide-react";
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
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const [completingIncident, setCompletingIncident] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
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
  
  // Get or create volunteer record
  useEffect(() => {
    if (!isAuthorized || !user) return;
    
    const getVolunteerRecord = async () => {
      try {
        // Check if volunteer record exists
        const { data: existing, error: fetchError } = await supabase
          .from('volunteers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
        
        if (existing) {
          setVolunteerId(existing.id);
        } else {
          // Create volunteer record
          const { data: newVolunteer, error: insertError } = await supabase
            .from('volunteers')
            .insert({ user_id: user.id, availability_status: true })
            .select('id')
            .single();
          
          if (insertError) throw insertError;
          setVolunteerId(newVolunteer.id);
        }
      } catch (error: any) {
        console.error('Error with volunteer record:', error);
        toast.error("Failed to set up volunteer profile");
      }
    };
    
    getVolunteerRecord();
  }, [isAuthorized, user]);
  
  // Fetch incidents from database
  useEffect(() => {
    if (!isAuthorized || !volunteerId) return;
    
    const fetchIncidents = async () => {
      try {
        // Fetch pending incidents OR incidents assigned to this volunteer
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .or(`status.eq.pending,assigned_volunteer_id.eq.${volunteerId}`)
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
        (payload) => {
          console.log('Real-time update:', payload);
          
          // Show browser notification for new incidents
          if (payload.eventType === 'INSERT' && 'Notification' in window) {
            const incident = payload.new as any;
            
            if (Notification.permission === 'granted') {
              new Notification('🚨 New Emergency Alert!', {
                body: `${incident.incident_type} - ${incident.location_address || 'Location unavailable'}`,
                icon: '/LOGO-RAHI .png',
                tag: incident.id,
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  new Notification('🚨 New Emergency Alert!', {
                    body: `${incident.incident_type} - ${incident.location_address || 'Location unavailable'}`,
                    icon: '/LOGO-RAHI .png',
                    tag: incident.id,
                  });
                }
              });
            }
          }
          
          fetchIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized, volunteerId]);

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
  
  const handleAcceptMission = async (incidentId: string) => {
    if (!volunteerId) {
      toast.error("Volunteer profile not ready");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ 
          status: 'accepted',
          assigned_volunteer_id: volunteerId 
        })
        .eq('id', incidentId);

      if (error) throw error;

      toast.success("Mission accepted! Prepare to respond.");
      
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch (error: any) {
      console.error('Error accepting mission:', error);
      toast.error("Failed to accept mission");
    }
  };
  
  const handleOnTheWay = async (incidentId: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: 'on_the_way' })
        .eq('id', incidentId);

      if (error) throw error;

      toast.success("Status updated: On the way!");
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };
  
  const handleArrived = async (incidentId: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: 'arrived' })
        .eq('id', incidentId);

      if (error) throw error;

      toast.success("Arrived at location! Stay safe.");
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };
  
  const handleCompleteIncident = async () => {
    if (!completingIncident) return;
    
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ 
          status: 'completed',
          volunteer_notes: notes,
          resolved_at: new Date().toISOString()
        })
        .eq('id', completingIncident);

      if (error) throw error;

      toast.success("Incident completed! Great work.");
      setCompletingIncident(null);
      setNotes("");
    } catch (error: any) {
      console.error('Error completing incident:', error);
      toast.error("Failed to complete incident");
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge variant="outline" className="border-primary text-primary">Mission Accepted</Badge>;
      case "on_the_way":
        return <Badge variant="outline" className="border-warning text-warning">On The Way</Badge>;
      case "arrived":
        return <Badge variant="outline" className="border-success text-success">Arrived & Assisting</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-muted text-muted">Completed</Badge>;
      default:
        return null;
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
              <Card className="p-12 text-center bg-success/5 border-success/20">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                <h3 className="text-xl font-semibold mb-2">No active emergencies right now ✅</h3>
                <p className="text-muted-foreground">Stay alert — you might receive a call anytime!</p>
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
                        {getStatusBadge(incident.status)}
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
                        <Button
                          onClick={() => handleAcceptMission(incident.id)}
                          variant="emergency"
                          className="gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          Accept Mission
                        </Button>
                      ) : incident.status === "accepted" ? (
                        <Button
                          onClick={() => handleOnTheWay(incident.id)}
                          className="gap-2"
                        >
                          <Car className="h-4 w-4" />
                          On The Way
                        </Button>
                      ) : incident.status === "on_the_way" ? (
                        <Button
                          onClick={() => handleArrived(incident.id)}
                          className="gap-2"
                        >
                          <Stethoscope className="h-4 w-4" />
                          Arrived & Assisting
                        </Button>
                      ) : incident.status === "arrived" ? (
                        <Button
                          onClick={() => setCompletingIncident(incident.id)}
                          variant="default"
                          className="gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Help Completed
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="justify-center py-2">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
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
      
      {/* Complete Incident Dialog */}
      <Dialog open={!!completingIncident} onOpenChange={(open) => !open && setCompletingIncident(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Mission</DialogTitle>
            <DialogDescription>
              Add any notes about the incident and assistance provided
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter notes about the incident, treatment provided, or any observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompletingIncident(null)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteIncident}>
              Complete Mission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Volunteer;
