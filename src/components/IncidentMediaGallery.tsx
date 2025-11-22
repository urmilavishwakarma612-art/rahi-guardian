import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Image as ImageIcon, Video, Loader2, ExternalLink } from 'lucide-react';
import { getIncidentMedia } from '@/lib/mediaUpload';
import { Button } from './ui/button';

interface IncidentMediaGalleryProps {
  incidentId: string;
}

export const IncidentMediaGallery = ({ incidentId }: IncidentMediaGalleryProps) => {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      const data = await getIncidentMedia(incidentId);
      setMedia(data);
      setIsLoading(false);
    };

    fetchMedia();
  }, [incidentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Photo/Video Evidence ({media.length})
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {media.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedMedia(item.publicUrl)}
              className="relative aspect-square rounded-lg overflow-hidden border hover:border-primary transition-all group"
            >
              {item.file_type === 'image' ? (
                <>
                  <img
                    src={item.publicUrl}
                    alt="Evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ImageIcon className="absolute bottom-1 left-1 h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              ) : (
                <>
                  <video
                    src={item.publicUrl}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(selectedMedia, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedMedia(null)}
              >
                Close
              </Button>
            </div>
            {selectedMedia.includes('.mp4') || selectedMedia.includes('.webm') || selectedMedia.includes('.mov') ? (
              <video
                src={selectedMedia}
                controls
                className="w-full max-h-[80vh] rounded-lg"
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Evidence"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
