import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Mic, MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MapView } from "@/components/MapView";
import { reverseGeocode } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { offlineQueue } from "@/lib/offlineQueue";
import { useLanguage } from "@/contexts/LanguageContext";

const Emergency = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("Fetching address...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("🌐 Back online! Syncing queued incidents...");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("📵 Offline mode - incidents will be queued");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
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
    // Check browser support for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (!location) {
      toast.error("Please wait for location to be detected first");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript("");
      toast.info("Recording started. Describe your emergency...");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript((prev) => prev + finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast.error(`Recording error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcript.trim()) {
        toast.success("Recording complete");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!location) {
      toast.error("Location required for emergency report");
      return;
    }

    if (!transcript.trim()) {
      toast.error("Please describe the emergency");
      return;
    }

    setIsSubmitting(true);

    // Check if offline
    if (!navigator.onLine) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        offlineQueue.add({
          data: {
            voice_transcript: transcript,
            description: transcript,
            location_lat: location.lat,
            location_lng: location.lng,
            location_address: address || null,
            incident_type: 'accident' as const,
            severity: 'high' as const,
            reporter_id: user?.id || null,
          }
        });
        
        setIsSubmitting(false);
        setTimeout(() => navigate("/volunteer"), 1500);
        return;
      } catch (error: any) {
        console.error('Error queuing offline incident:', error);
        toast.error("Failed to queue incident");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Get AI analysis first
      toast.info("🤖 AI analyzing your emergency...");
      
      const { data: analysisData, error: aiError } = await supabase.functions.invoke('analyze-incident', {
        body: {
          transcript,
          incidentType: 'accident',
          location: address || `${location.lat}, ${location.lng}`
        }
      });

      let aiAnalysis = null;
      let suggestedSeverity = 'high';
      
      if (!aiError && analysisData?.analysis) {
        aiAnalysis = analysisData.analysis;
        // Parse severity from AI response
        if (aiAnalysis.toLowerCase().includes('critical')) {
          suggestedSeverity = 'critical';
        } else if (aiAnalysis.toLowerCase().includes('low')) {
          suggestedSeverity = 'low';
        } else if (aiAnalysis.toLowerCase().includes('medium')) {
          suggestedSeverity = 'medium';
        }
        console.log('AI Analysis:', aiAnalysis);
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Save incident to database with AI analysis
      const { data, error } = await supabase
        .from('incidents')
        .insert({
          voice_transcript: transcript,
          description: aiAnalysis || transcript,
          location_lat: location.lat,
          location_lng: location.lng,
          location_address: address || null,
          incident_type: 'accident' as const,
          severity: suggestedSeverity as 'low' | 'medium' | 'high' | 'critical',
          status: 'pending' as const,
          reporter_id: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("🚨 Emergency reported! AI-powered alert sent to volunteers.");
      
      // Navigate to volunteer page after 2 seconds
      setTimeout(() => {
        navigate("/volunteer");
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting emergency:', error);
      toast.error("Failed to submit report: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
              <span className="font-semibold">{t('emergency.active')}</span>
              {!isOnline && <span className="text-xs ml-2">• OFFLINE MODE</span>}
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('emergency.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('emergency.subtitle')}
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
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!location}
                  variant={isRecording ? "secondary" : "emergency"}
                  size="lg"
                  className="w-64 h-64 rounded-full text-xl font-bold shadow-emergency hover:scale-105 transition-all"
                >
                  {isRecording ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-12 w-12 animate-spin" />
                      <span>Recording...<br />Tap to Stop</span>
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
                <Button 
                  onClick={handleSubmit} 
                  variant="success" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Submit Emergency Report
                    </>
                  )}
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
