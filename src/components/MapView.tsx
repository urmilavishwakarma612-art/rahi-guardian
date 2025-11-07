import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { MapPin } from "lucide-react";

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

// Fix default marker icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "medium":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createIncidentIcon = (severity: string) => {
  const color = getSeverityColor(severity);
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to handle routing
const RoutingMachine = ({ userLocation, selectedIncident }: { userLocation: Location; selectedIncident: Location }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation || !selectedIncident) return;

    const routingControl = (L.Routing as any).control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(selectedIncident.lat, selectedIncident.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 4, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      show: false,
      createMarker: () => null, // Don't create default markers
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, selectedIncident]);

  return null;
};

// Component to recenter map
const RecenterMap = ({ center }: { center: Location }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);

  return null;
};

export const MapView = ({
  incidents = [],
  volunteers = [],
  userLocation,
  selectedIncident,
  showDirections = false,
  className = "",
}: MapViewProps) => {
  const defaultCenter = { lat: 37.7749, lng: -122.4194 };
  const center = userLocation || selectedIncident || defaultCenter;

  return (
    <div className={className}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg"
      >
        <>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap center={center} />

          {/* User location marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createCustomIcon("#3b82f6")}>
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {/* Incident markers */}
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.location.lat, incident.location.lng]}
              icon={createIncidentIcon(incident.severity)}
            >
              <Popup>
                <div className="font-semibold">{incident.severity.toUpperCase()}</div>
                <div className="text-sm">{incident.description}</div>
              </Popup>
            </Marker>
          ))}

          {/* Volunteer markers */}
          {volunteers.map((volunteer) => (
            <Marker
              key={volunteer.id}
              position={[volunteer.location.lat, volunteer.location.lng]}
              icon={createCustomIcon("#22c55e")}
            >
              <Popup>
                <div className="font-semibold">{volunteer.name}</div>
                <div className="text-sm">Volunteer</div>
              </Popup>
            </Marker>
          ))}

          {/* Directions */}
          {showDirections && userLocation && selectedIncident && (
            <RoutingMachine userLocation={userLocation} selectedIncident={selectedIncident} />
          )}
        </>
      </MapContainer>
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
