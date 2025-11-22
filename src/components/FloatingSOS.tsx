import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export const FloatingSOS = () => {
  return (
    <Link to="/emergency">
      <Button
        variant="emergency"
        size="lg"
        className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full shadow-emergency hover:scale-110 transition-all duration-300 animate-glow hover:shadow-glow"
        title="Emergency SOS"
      >
        <AlertTriangle className="h-8 w-8 animate-pulse" />
      </Button>
    </Link>
  );
};
