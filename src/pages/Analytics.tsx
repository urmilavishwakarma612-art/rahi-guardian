import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import IncidentHeatmap from '@/components/IncidentHeatmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface IncidentStats {
  total: number;
  pending: number;
  active: number;
  resolved: number;
  avgResponseTime: number;
  activeVolunteers: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
}

const Analytics = () => {
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all incidents for heatmap
      const { data: incidentData, error: incidentError } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (incidentError) throw incidentError;
      setIncidents(incidentData || []);

      // Calculate statistics
      const total = incidentData?.length || 0;
      const pending = incidentData?.filter(i => i.status === 'pending').length || 0;
      const active = incidentData?.filter(i => ['assigned', 'en_route', 'on_scene'].includes(i.status)).length || 0;
      const resolved = incidentData?.filter(i => i.status === 'resolved').length || 0;

      // Calculate average response time (for resolved incidents)
      const resolvedIncidents = incidentData?.filter(i => i.status === 'resolved' && i.resolved_at) || [];
      const avgResponseTime = resolvedIncidents.length > 0
        ? resolvedIncidents.reduce((acc, inc) => {
            const created = new Date(inc.created_at).getTime();
            const resolved = new Date(inc.resolved_at).getTime();
            return acc + (resolved - created);
          }, 0) / resolvedIncidents.length / 60000 // Convert to minutes
        : 0;

      // Get active volunteers
      const { data: volunteerData } = await supabase
        .from('volunteers')
        .select('*')
        .eq('availability_status', true);

      // Group by type and severity
      const byType = incidentData?.reduce((acc, inc) => {
        acc[inc.incident_type] = (acc[inc.incident_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const bySeverity = incidentData?.reduce((acc, inc) => {
        acc[inc.severity] = (acc[inc.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setStats({
        total,
        pending,
        active,
        resolved,
        avgResponseTime: Math.round(avgResponseTime),
        activeVolunteers: volunteerData?.length || 0,
        byType,
        bySeverity
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeChartData = stats ? Object.entries(stats.byType).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    count: value
  })) : [];

  const severityChartData = stats ? Object.entries(stats.bySeverity).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  })) : [];

  const COLORS = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into emergency response performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pending || 0} pending, {stats?.active || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.resolved || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.total ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avgResponseTime || 0} min</div>
              <p className="text-xs text-muted-foreground">
                Time to resolution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeVolunteers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Available for response
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incident Hotspot Heatmap
            </CardTitle>
            <CardDescription>
              Visual representation of incident density across regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentHeatmap incidents={incidents} />
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Type</CardTitle>
              <CardDescription>Distribution of incident categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incidents by Severity</CardTitle>
              <CardDescription>Severity distribution of reported incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
