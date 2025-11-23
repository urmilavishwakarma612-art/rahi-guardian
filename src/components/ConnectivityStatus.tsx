import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Smartphone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ConnectivityStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [gpsStatus, setGpsStatus] = useState<'active' | 'searching' | 'unavailable'>('searching');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check GPS availability
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setGpsStatus('active'),
        () => setGpsStatus('unavailable'),
        { timeout: 5000 }
      );
    } else {
      setGpsStatus('unavailable');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Card className="p-4 bg-background/50 backdrop-blur-sm border-2">
      <div className="flex items-center justify-between gap-4">
        {/* Network Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-success animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-success">Online</p>
                <p className="text-xs text-muted-foreground">Data syncing active</p>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-semibold text-warning">Offline Mode</p>
                <p className="text-xs text-muted-foreground">Will sync when online</p>
              </div>
            </>
          )}
        </div>

        {/* GPS Status */}
        <div className="flex items-center gap-2">
          <MapPin className={`h-4 w-4 ${
            gpsStatus === 'active' ? 'text-success animate-pulse' : 
            gpsStatus === 'searching' ? 'text-warning' : 
            'text-destructive'
          }`} />
          <div>
            <p className="text-sm font-semibold">GPS Signal</p>
            <Badge 
              variant={gpsStatus === 'active' ? 'default' : gpsStatus === 'searching' ? 'secondary' : 'destructive'}
              className={`text-xs ${gpsStatus === 'active' ? 'bg-success text-success-foreground' : ''}`}
            >
              {gpsStatus === 'active' ? 'Active' : 
               gpsStatus === 'searching' ? 'Searching' : 
               'Unavailable'}
            </Badge>
          </div>
        </div>

        {/* Cellular Hint */}
        {!isOnline && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <div>
              <p className="text-xs">SMS fallback ready</p>
              <p className="text-xs">if cellular available</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
