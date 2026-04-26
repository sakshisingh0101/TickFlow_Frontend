import { useState, useEffect } from 'react';
import { Users, Ticket, Film, MonitorPlay, IndianRupee, RefreshCcw, TrendingUp } from 'lucide-react';
import api from '../../../api/axios';

export default function OverviewTab() {
  const [stats, setStats] = useState({
    adminStats: null,
    revenueStats: null,
    occupancyStats: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [adminRes, revRes, occRes] = await Promise.all([
          api.get('/admin/getAdminStats'),
          api.get('/admin/getRevenueStats'),
          api.get('/admin/getOccupancyStats')
        ]);
        
        setStats({
          adminStats: adminRes.data.data,
          revenueStats: revRes.data.data,
          occupancyStats: occRes.data.data
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-primary">Loading stats...</div>;
  }

  const { adminStats, revenueStats, occupancyStats } = stats;

  const statCards = [
    { label: 'Total Revenue', value: `₹${revenueStats?.totalRevenue || 0}`, icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Users', value: adminStats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Bookings', value: adminStats?.totalBookings || 0, icon: Ticket, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Occupancy Rate', value: `${occupancyStats?.occupancyPercent || 0}%`, icon: TrendingUp, color: 'text-gold', bg: 'bg-yellow-500/10' },
    { label: 'Active Movies', value: adminStats?.totalMovies || 0, icon: Film, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Shows', value: adminStats?.totalShows || 0, icon: MonitorPlay, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total Refunds', value: revenueStats?.totalRefunds || 0, icon: RefreshCcw, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-muted">Real-time metrics and performance data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-card border border-gray-800 rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-muted text-sm font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional space for charts or recent activities could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
         <div className="bg-card border border-gray-800 rounded-2xl p-6 min-h-[300px]">
            <h3 className="text-xl font-bold text-white mb-4">Daily Bookings Trend</h3>
            <div className="flex items-center justify-center h-48 text-muted border border-dashed border-gray-700 rounded-xl">
               Chart Placeholder
            </div>
         </div>
         <div className="bg-card border border-gray-800 rounded-2xl p-6 min-h-[300px]">
            <h3 className="text-xl font-bold text-white mb-4">Seat Occupancy</h3>
            <div className="flex items-center justify-center h-48 text-muted border border-dashed border-gray-700 rounded-xl">
               {occupancyStats?.bookedSeats} Booked out of {occupancyStats?.totalSeats} Total Seats
            </div>
         </div>
      </div>
    </div>
  );
}
