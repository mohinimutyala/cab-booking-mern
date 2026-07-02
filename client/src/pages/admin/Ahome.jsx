import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import Loader from '../../components/Loader';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Car, BookOpen, Truck, TrendingUp, DollarSign } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Ahome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const chartData = [
    { name: 'Users', value: stats?.users || 0 },
    { name: 'Cabs', value: stats?.cabs || 0 },
    { name: 'Bookings', value: stats?.bookings || 0 },
    { name: 'Drivers', value: stats?.drivers || 0 },
  ];

  const monthlyChart = stats?.monthlyData?.map((d) => ({
    month: MONTH_NAMES[d._id - 1] || d._id,
    bookings: d.count,
  })) || [];

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white">Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
          </div>

          {loading ? <Loader /> : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard title="Total Users" value={stats?.users} to="/admin/users" icon={Users} color="blue" />
                <StatsCard title="Total Cabs" value={stats?.cabs} to="/admin/cabs" icon={Car} color="yellow" />
                <StatsCard title="Total Bookings" value={stats?.bookings} to="/admin/bookings" icon={BookOpen} color="green" />
                <StatsCard title="Total Drivers" value={stats?.drivers} to="/admin/drivers" icon={Truck} color="purple" />
              </div>

              {/* Revenue */}
              <div className="card mb-8 border-yellow-400/20 bg-yellow-400/3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40">Total Revenue (Completed Rides)</p>
                    <p className="text-3xl font-black text-yellow-400">₹{stats?.totalRevenue?.toFixed(0) || 0}</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Platform stats bar chart */}
                <div className="card">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">Platform Overview</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: '#111114', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                      <Bar dataKey="value" fill="#f5c518" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly bookings */}
                <div className="card">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">Monthly Bookings</h3>
                  {monthlyChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={monthlyChart} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: '#111114', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                        <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-52 flex items-center justify-center text-white/20 text-sm">No booking data yet</div>
                  )}
                </div>
              </div>

              {/* Recent bookings table */}
              {stats?.recentBookings?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="table-header">
                          <th className="px-3 py-2 text-left">Trip</th>
                          <th className="px-3 py-2 text-left">User</th>
                          <th className="px-3 py-2 text-left">Car</th>
                          <th className="px-3 py-2 text-left">Fare</th>
                          <th className="px-3 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentBookings.map((b) => (
                          <tr key={b._id} className="table-row">
                            <td className="px-3 py-2 text-white/70">{b.selectedPickupCity} → {b.selectedDropCity}</td>
                            <td className="px-3 py-2 text-white/50">{b.userName || '—'}</td>
                            <td className="px-3 py-2 text-white/50">{b.carname}</td>
                            <td className="px-3 py-2 text-yellow-400 font-medium">₹{b.fare}</td>
                            <td className="px-3 py-2"><span className={b.status === 'Completed' ? 'badge-completed' : b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-pending'}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Ahome;
