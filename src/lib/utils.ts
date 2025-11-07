import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EmergencyResponseApp/1.0'
        }
      }
    );
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    const address = data.address;
    
    // Format address nicely
    const parts = [
      address.road || address.suburb || address.neighbourhood,
      address.city || address.town || address.village,
      address.state,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ') || data.display_name;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Address not available';
  }
}
