import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Mic, MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MapView } from "@/components/MapView";
import { reverseGeocode } from "@/lib/utils";

const Emergency = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("Fetching address...");
  // Get user location on component mount with high accuracy + continuous updates
  useEffect(() => {
    if ("geolocation" in navigator) {
      const options: PositionOptions = {
        enableHighAccuracy: true, // Request GPS if available
        timeout: 15000,
        maximumAge: 0,
      };

      const onSuccess = async (position: GeolocationPosition) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setAccuracy(acc);
        // Only toast on the first reliable fix
        if (!location) {
          toast.success(`Location detected (accuracy: ${Math.round(acc)}m)`);
        }
        console.log("Geolocation fix:", { latitude, longitude, accuracy: acc, timestamp: position.timestamp });
        
        // Fetch address from coordinates
        const fetchedAddress = await reverseGeocode(latitude, longitude);
        setAddress(fetchedAddress);
      };

      const onError = (error: GeolocationPositionError) => {
        let errorMessage = "Unable to access location. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location permissions in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable. Try moving to an open sky area and enable GPS.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again.";
            break;
          default:
            errorMessage += "Unknown error.";
        }
        setLocationError(errorMessage);
        toast.error("Location access failed");
        console.error("Geolocation error:", error);
      };

      // Get an immediate reading
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
      // Start continuous updates to refine accuracy
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);
  
  const startRecording = () => {
    setIsRecording(true);
    toast.info("Recording started. Describe your emergency...");
    
    // Simulate voice recording
    setTimeout(() => {
      setTranscript("Car accident on Highway 101, near Exit 42. Two vehicles involved. Need immediate medical assistance.");
      setIsRecording(false);
      toast.success("Recording complete");
    }, 3000);
  };
  
  const handleSubmit = () => {
    if (!location) {
      toast.error("Location required for emergency report");
      return;
    }
    
    toast.success("Emergency report submitted! Volunteers are being notified.");
    setTimeout(() => {
      navigate("/volunteer");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emergency/10 text-emergency rounded-full mb-4">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Emergency Mode Active</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Report Highway Emergency</h1>
            <p className="text-lg text-muted-foreground">
              Stay calm. We're here to help. Provide details and we'll dispatch assistance immediately.
            </p>
          </div>
          
          {/* Main Emergency Card */}
          <Card className="p-8 mb-6 shadow-strong">
            {/* Location Status */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Your Location
                </h2>
                {location ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              
              {location ? (
                <div className="space-y-4">
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-success mb-1">Location Acquired</p>
                    <p className="text-sm font-semibold mb-2">{address}</p>
                    <p className="text-xs text-muted-foreground">
                      Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      GPS Accuracy: ~{accuracy ? Math.round(accuracy) : "?"}m
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Emergency services will be dispatched to this location
                    </p>
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <MapView
                      userLocation={location}
                      selectedIncident={location}
                      className="h-[300px]"
                    />
                  </div>
                </div>
              ) : locationError ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-destructive mb-1">Location Error</p>
                  <p className="text-sm text-muted-foreground">{locationError}</p>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Detecting your location...</p>
                </div>
              )}
            </div>
            
            {/* Voice Recording */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Describe the Emergency
              </h2>
              
              <div className="text-center py-12">
                <Button
                  onClick={startRecording}
                  disabled={isRecording || !location}
                  variant={isRecording ? "secondary" : "emergency"}
                  size="lg"
                  className="w-64 h-64 rounded-full text-xl font-bold shadow-emergency hover:scale-105 transition-all"
                >
                  {isRecording ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-12 w-12 animate-spin" />
                      <span>Recording...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle className="h-16 w-16" />
                      <span>Press to<br />Report SOS</span>
                    </div>
                  )}
                </Button>
              </div>
              
              {transcript && (
                <div className="mt-6 bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Transcript:</p>
                  <p className="text-muted-foreground">{transcript}</p>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            {transcript && location && (
              <div className="space-y-4">
                <Button onClick={handleSubmit} variant="success" size="lg" className="w-full">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Emergency Report
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you authorize RAHI to alert emergency services, volunteers, and your emergency contacts
                </p>
              </div>
            )}
          </Card>
          
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                What Happens Next?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• AI analyzes severity level</li>
                <li>• Nearest volunteers notified</li>
                <li>• Emergency services dispatched</li>
                <li>• You receive first aid instructions</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Emergency Hotlines
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Emergency: <strong>911</strong></li>
                <li>• Highway Patrol: <strong>1-800-XXX-XXXX</strong></li>
                <li>• Poison Control: <strong>1-800-222-1222</strong></li>
                <li>• Mental Health: <strong>988</strong></li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Emergency;
