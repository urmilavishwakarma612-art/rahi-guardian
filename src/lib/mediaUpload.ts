import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MediaUploadResult {
  filePath: string;
  fileType: 'image' | 'video';
  mimeType: string;
  fileSize: number;
  publicUrl: string;
}

export const uploadIncidentMedia = async (
  file: File,
  incidentId: string,
  userId: string | null
): Promise<MediaUploadResult | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId || 'anonymous'}/${incidentId}/${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('incident-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('incident-media')
      .getPublicUrl(filePath);

    const fileType = file.type.startsWith('video/') ? 'video' : 'image';

    // Insert metadata into incident_media table
    const { error: dbError } = await supabase
      .from('incident_media')
      .insert({
        incident_id: incidentId,
        file_path: filePath,
        file_type: fileType,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: userId,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to clean up uploaded file
      await supabase.storage.from('incident-media').remove([filePath]);
      throw dbError;
    }

    return {
      filePath,
      fileType,
      mimeType: file.type,
      fileSize: file.size,
      publicUrl,
    };
  } catch (error: any) {
    console.error('Media upload failed:', error);
    toast.error(`Failed to upload ${file.name}: ${error.message}`);
    return null;
  }
};

export const uploadMultipleMedia = async (
  files: File[],
  incidentId: string,
  userId: string | null
): Promise<MediaUploadResult[]> => {
  const results: MediaUploadResult[] = [];

  for (const file of files) {
    const result = await uploadIncidentMedia(file, incidentId, userId);
    if (result) {
      results.push(result);
    }
  }

  return results;
};

export const getIncidentMedia = async (incidentId: string) => {
  const { data, error } = await supabase
    .from('incident_media')
    .select('*')
    .eq('incident_id', incidentId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch incident media:', error);
    return [];
  }

  // Get public URLs for all files
  const mediaWithUrls = data.map((item) => {
    const { data: { publicUrl } } = supabase.storage
      .from('incident-media')
      .getPublicUrl(item.file_path);

    return {
      ...item,
      publicUrl,
    };
  });

  return mediaWithUrls;
};
