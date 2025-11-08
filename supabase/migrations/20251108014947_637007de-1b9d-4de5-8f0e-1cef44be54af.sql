-- Add new status values to incident_status enum
ALTER TYPE incident_status ADD VALUE IF NOT EXISTS 'accepted';
ALTER TYPE incident_status ADD VALUE IF NOT EXISTS 'on_the_way';
ALTER TYPE incident_status ADD VALUE IF NOT EXISTS 'arrived';
ALTER TYPE incident_status ADD VALUE IF NOT EXISTS 'completed';

-- Add volunteer notes field to incidents
ALTER TABLE incidents ADD COLUMN IF NOT EXISTS volunteer_notes text;

-- Add ETA field for tracking estimated arrival time
ALTER TABLE incidents ADD COLUMN IF NOT EXISTS estimated_arrival timestamp with time zone;

-- Create index for faster queries on assigned volunteer
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_volunteer 
ON incidents(assigned_volunteer_id) WHERE assigned_volunteer_id IS NOT NULL;

-- Update RLS policy to allow volunteers to see their assigned incidents
DROP POLICY IF EXISTS "Volunteers can view assigned incidents" ON incidents;
CREATE POLICY "Volunteers can view assigned incidents"
ON incidents
FOR SELECT
TO authenticated
USING (
  assigned_volunteer_id IN (
    SELECT id FROM volunteers WHERE user_id = auth.uid()
  )
  OR status = 'pending'
);