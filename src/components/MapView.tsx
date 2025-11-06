import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { MapPin, Navigation } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface MapViewProps {
  incidents?: Array<{
    id: number;
    location: Location;
    severity: string;
    description: string;
  }>;
  volunteers?: Array<{
    id: number;
    location: Location;
    name: string;
  }>;
  userLocation?: Location;
  selectedIncident?: Location;
  showDirections?: boolean;
  className?: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

export const MapView = ({
  incidents = [],
  volunteers = [],
  userLocation,
  selectedIncident,
  showDirections = false,
  className = "",
}: MapViewProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState("");

  const center = userLocation || selectedIncident || defaultCenter;

  useEffect(() => {
    // In production, this should come from Supabase secrets
    // For now, we'll use an environment variable as fallback
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    setApiKey(key);
  }, []);

  useEffect(() => {
    if (showDirections && userLocation && selectedIncident && map) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: selectedIncident,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          }
        }
      );
    }
  }, [showDirections, userLocation, selectedIncident, map]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ef4444"; // emergency color
      case "high":
        return "#f97316"; // warning color
      case "medium":
        return "#3b82f6"; // primary color
      default:
        return "#6b7280"; // muted color
    }
  };

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">Google Maps API key not configured</p>
          <p className="text-xs text-muted-foreground">
            Add GOOGLE_MAPS_API_KEY to your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={setMap}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          )}

          {/* Incident markers */}
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={incident.location}
              icon={{
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: getSeverityColor(incident.severity),
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                rotation: 180,
              }}
              title={incident.description}
            />
          ))}

          {/* Volunteer markers */}
          {volunteers.map((volunteer) => (
            <Marker
              key={volunteer.id}
              position={volunteer.location}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: "#22c55e",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
              title={volunteer.name}
            />
          ))}

          {/* Directions */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export const calculateDistance = (from: Location, to: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
