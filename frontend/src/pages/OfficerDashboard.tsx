import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardCharts } from "@/components/DashboardCharts";
import { LogOut, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import StatsCards from '@/components/dashboard/StatsCards';
import Filters from '@/components/dashboard/Filters';
import ComplaintsTable from '@/components/dashboard/ComplaintsTable';
import { api } from '@/services/api';
import type { Complaint, DashboardStats, ComplaintStatus } from '@/lib/types';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, resolved: 0, highPriority: 0 });
  const [byCategory, setByCategory] = useState<Record<string, number>>({});
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [topAreas, setTopAreas] = useState<Array<{ area: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Check authentication
  useEffect(() => {
    const token = sessionStorage.getItem('officerToken');
    if (!token) {
      navigate('/officer');
    }
  }, [navigate]);

  // Fetch data
  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);

    try {
      const data = await api.getDashboard();
      setComplaints(data.recent_high_priority || []);
      setStats(data.stats);
      setByCategory(data.by_category || {});
      setByStatus(data.by_status || {});
      setTopAreas(data.top_areas || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle status change
  const handleStatusChange = async (id: string, status: ComplaintStatus) => {
    await api.updateStatus(Number(id), status);
    fetchData();
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('officerToken');
    navigate('/officer');
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toString().includes(searchQuery) ||
      (complaint.contact?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All Categories' || complaint.category === categoryFilter;
    const matchesArea = areaFilter === 'All Areas' || complaint.area === areaFilter;
    const matchesStatus = statusFilter === 'All Statuses' || complaint.status === statusFilter;

    return matchesSearch && matchesCategory && matchesArea && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary/50" />
            </div>
          </div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Loading civic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-3xl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container w-full max-w-[1600px] flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Civisense</h1>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block -mt-1">Officer Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${isRefreshing ? 'text-primary' : 'text-slate-400'}`}>
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Live Synced'}
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800">
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container w-full max-w-[1600px] px-6 py-8 space-y-8">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Monitor and respond to citizen grievances in real-time.
            </p>
          </div>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />
        {/* Dashboard Charts */}
        <DashboardCharts
          byCategory={byCategory}
          byStatus={byStatus}
          topAreas={topAreas}
        />

        {/* Complaints Section */}
        <Card className="glass-panel border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-white/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Recent Grievances
                </CardTitle>
                <CardDescription>
                  Review and update high-priority complaints from citizens.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="p-6 space-y-6">
            {/* Filters */}
            <Filters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              areaFilter={areaFilter}
              onAreaChange={setAreaFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              isRefreshing={isRefreshing}
            />

            {/* Table */}
            <ComplaintsTable
              complaints={filteredComplaints}
              onStatusChange={handleStatusChange}
            />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default OfficerDashboard;
