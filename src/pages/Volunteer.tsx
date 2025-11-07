import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock, AlertTriangle, Navigation, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { MapView, calculateDistance } from "@/components/MapView";
import { reverseGeocode } from "@/lib/utils";

const Volunteer = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("Detecting location...");
  useEffect(() => {
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
  }, []);

  const mockIncidents = [
    {
      id: 1,
      type: "accident",
      severity: "critical",
      description: "Multi-vehicle collision on Highway 101 near Exit 42",
      location: "Highway 101, Exit 42",
      coordinates: { lat: 37.7849, lng: -122.4094 },
      distance: "2.3 km",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "medical",
      severity: "high",
      description: "Medical emergency - chest pain reported",
      location: "Highway 95, Mile Marker 128",
      coordinates: { lat: 37.7649, lng: -122.4294 },
      distance: "5.1 km",
      time: "8 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      type: "breakdown",
      severity: "medium",
      description: "Vehicle breakdown blocking right lane",
      location: "Interstate 5, Near Rest Stop",
      coordinates: { lat: 37.7949, lng: -122.3994 },
      distance: "12.4 km",
      time: "15 minutes ago",
      status: "in_progress",
    },
  ];

  const mockVolunteers = [
    { id: 1, name: "John Doe", location: { lat: 37.7749, lng: -122.4144 } },
    { id: 2, name: "Jane Smith", location: { lat: 37.7849, lng: -122.4244 } },
  ];
  
  const handleRespond = (incidentId: number) => {
    toast.success("Responding to incident! Navigation starting...");
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
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-hero rounded-lg">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Volunteer Dashboard</h1>
                <p className="text-muted-foreground">Active incidents in your area</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Incidents</p>
                    <p className="text-2xl font-bold text-emergency">3</p>
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
              incidents={mockIncidents.map(inc => ({
                id: inc.id,
                location: inc.coordinates,
                severity: inc.severity,
                description: inc.description,
              }))}
              volunteers={mockVolunteers}
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
            
            {mockIncidents.map((incident) => (
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
                    
                    <h3 className="text-lg font-semibold mb-2">{incident.description}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{incident.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4" />
                        <span>{incident.distance} away</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{incident.time}</span>
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
            ))}
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
