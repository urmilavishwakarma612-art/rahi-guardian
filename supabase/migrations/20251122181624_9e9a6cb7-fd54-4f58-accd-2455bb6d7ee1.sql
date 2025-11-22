-- Create storage bucket for incident media (photos and videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'incident-media',
  'incident-media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Create incident_media table to track uploaded files
CREATE TABLE IF NOT EXISTS public.incident_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image' or 'video'
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on incident_media
ALTER TABLE public.incident_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for incident_media table
CREATE POLICY "Users can view media for incidents they can access"
  ON public.incident_media
  FOR SELECT
  USING (
    incident_id IN (
      SELECT id FROM public.incidents 
      WHERE reporter_id = auth.uid() 
      OR assigned_volunteer_id IN (
        SELECT id FROM public.volunteers WHERE user_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('volunteer', 'admin', 'authority')
    )
  );

CREATE POLICY "Users can upload media for their own incidents"
  ON public.incident_media
  FOR INSERT
  WITH CHECK (
    incident_id IN (
      SELECT id FROM public.incidents WHERE reporter_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('volunteer', 'admin', 'authority')
    )
  );

-- Storage RLS Policies for incident-media bucket
CREATE POLICY "Public can view incident media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'incident-media');

CREATE POLICY "Authenticated users can upload incident media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'incident-media'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own incident media"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'incident-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own incident media"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'incident-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create index for faster queries
CREATE INDEX idx_incident_media_incident_id ON public.incident_media(incident_id);
CREATE INDEX idx_incident_media_uploaded_at ON public.incident_media(uploaded_at DESC);