import { toast } from 'sonner';

export interface QueuedIncident {
  id: string;
  timestamp: number;
  data: {
    voice_transcript: string;
    description: string;
    location_lat: number;
    location_lng: number;
    location_address: string | null;
    incident_type: 'accident' | 'breakdown' | 'medical' | 'fire' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    reporter_id: string | null;
  };
}

const QUEUE_KEY = 'rahi-offline-incidents';

export const offlineQueue = {
  add: (incident: Omit<QueuedIncident, 'id' | 'timestamp'>): void => {
    const queue = offlineQueue.getAll();
    const newIncident: QueuedIncident = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...incident,
    };
    queue.push(newIncident);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    toast.success('📥 Incident saved offline. Will sync when online.');
  },

  getAll: (): QueuedIncident[] => {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  remove: (id: string): void => {
    const queue = offlineQueue.getAll().filter(item => item.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  clear: (): void => {
    localStorage.removeItem(QUEUE_KEY);
  },

  count: (): number => {
    return offlineQueue.getAll().length;
  },
};

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    const queue = offlineQueue.getAll();
    if (queue.length === 0) return;

    toast.info(`🔄 Syncing ${queue.length} offline incident(s)...`);

    const { supabase } = await import('@/integrations/supabase/client');
    
    let successCount = 0;
    let failCount = 0;

    for (const item of queue) {
      try {
        const { error } = await supabase
          .from('incidents')
          .insert({
            ...item.data,
            status: 'pending' as const,
          });

        if (error) throw error;

        offlineQueue.remove(item.id);
        successCount++;
      } catch (error) {
        console.error('Failed to sync incident:', error);
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`✅ Synced ${successCount} incident(s) successfully!`);
    }
    if (failCount > 0) {
      toast.error(`❌ Failed to sync ${failCount} incident(s). Will retry.`);
    }
  });
}
