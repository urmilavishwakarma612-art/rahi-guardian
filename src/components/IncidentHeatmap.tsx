import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import 'leaflet.heat';

interface IncidentHeatmapProps {
  incidents: Array<{
    location_lat: number;
    location_lng: number;
    severity: string;
  }>;
}

const IncidentHeatmap = ({ incidents }: IncidentHeatmapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map centered on India
      mapRef.current = L.map('heatmap').setView([20.5937, 78.9629], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || incidents.length === 0) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    // Convert incidents to heatmap points with intensity based on severity
    const heatPoints = incidents.map(incident => {
      const intensity = 
        incident.severity === 'critical' ? 1.0 :
        incident.severity === 'high' ? 0.7 :
        incident.severity === 'medium' ? 0.5 : 0.3;
      
      return [incident.location_lat, incident.location_lng, intensity];
    });

    // @ts-ignore - leaflet.heat types not available
    heatLayerRef.current = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      max: 1.0,
      gradient: {
        0.0: '#0000ff',
        0.4: '#00ff00',
        0.6: '#ffff00',
        0.8: '#ff8000',
        1.0: '#ff0000'
      }
    }).addTo(mapRef.current);

    // Fit map to show all incidents
    if (heatPoints.length > 0) {
      const bounds = L.latLngBounds(heatPoints.map(p => [p[0], p[1]]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [incidents]);

  return (
    <div 
      id="heatmap" 
      className="w-full h-[500px] rounded-lg border border-border overflow-hidden"
    />
  );
};

export default IncidentHeatmap;
