import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera, Video, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploadProps {
  onMediaUploaded?: (mediaFiles: UploadedMedia[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export interface UploadedMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export const MediaUpload = ({ onMediaUploaded, maxFiles = 5, disabled = false }: MediaUploadProps) => {
  const [mediaFiles, setMediaFiles] = useState<UploadedMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null, type: 'image' | 'video') => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedMedia[] = [];
    
    Array.from(files).forEach((file) => {
      // Check file size (50MB limit)
      if (file.size > 52428800) {
        toast.error(`${file.name} is too large. Maximum file size is 50MB.`);
        return;
      }

      // Check total files
      if (mediaFiles.length + newFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      newFiles.push({ file, preview, type });
    });

    const updatedMedia = [...mediaFiles, ...newFiles];
    setMediaFiles(updatedMedia);
    if (onMediaUploaded) {
      onMediaUploaded(updatedMedia);
    }
  };

  const removeMedia = (index: number) => {
    const updated = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updated);
    if (onMediaUploaded) {
      onMediaUploaded(updated);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files, 'image')}
          disabled={disabled}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files, 'video')}
          disabled={disabled}
        />

        <Button
          type="button"
          variant="outline"
          onClick={handlePhotoClick}
          disabled={disabled || mediaFiles.length >= maxFiles}
          className="gap-2"
        >
          <Camera className="h-4 w-4" />
          Add Photos
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleVideoClick}
          disabled={disabled || mediaFiles.length >= maxFiles}
          className="gap-2"
        >
          <Video className="h-4 w-4" />
          Add Videos
        </Button>

        {mediaFiles.length > 0 && (
          <span className="text-sm text-muted-foreground self-center">
            {mediaFiles.length} / {maxFiles} files
          </span>
        )}
      </div>

      {/* Media Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {mediaFiles.map((media, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>

              {media.type === 'image' ? (
                <div className="aspect-square">
                  <img
                    src={media.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Image
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <video
                    src={media.preview}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                  <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {mediaFiles.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            Add photos or videos as evidence
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} files, 50MB each • JPG, PNG, MP4, WebM
          </p>
        </Card>
      )}
    </div>
  );
};
