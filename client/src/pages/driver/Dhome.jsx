import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Car, MapPin, CheckCircle, XCircle, PlayCircle, Star, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';

const STATUS_BADGE = {
  'Pending': 'badge-pending', 'Confirmed': 'badge-confirmed',
  'On the Way': 'badge-on-way', 'Arrived': 'badge-on-way',
  'In Progress': 'badge-on-way', 'Completed': 'badge-completed', 'Cancelled': 'badge-cancelled',
};

const Dhome = () => {
  const { driverInfo, loginDriver } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          api.get('/drivers/profile'),
          api.get('/bookings/driver'),
        ]);
        setProfile(profileRes.data);
        setBookings(bookingsRes.data.filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled').slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleOnline = async () => {
    setTogglingStatus(true);
    try {
      const { data } = await api.put('/drivers/status');
      setProfile((prev) => ({ ...prev, isOnline: data.isOnline }));
      loginDriver({ ...driverInfo, isOnline: data.isOnline });
      toast.success(data.isOnline ? 'You are now online!' : 'You are now offline');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/drivers/ride/${id}/${action}`);
      toast.success(`Ride ${action}ed`);
      setBookings((prev) => prev.map((b) => {
        if (b._id !== id) return b;
        const statusMap = { accept: 'Confirmed', reject: 'Cancelled', start: 'In Progress', complete: 'Completed' };
        return { ...b, status: statusMap[action] || b.status };
      }).filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled'));
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading ? <Loader /> : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-white">Driver Dashboard</h1>
                <p className="text-white/40 text-sm">{profile?.name}</p>
              </div>
              <button id="toggle-online-btn" onClick={handleToggleOnline} disabled={togglingStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${profile?.isOnline ? 'bg-green-400/15 border-green-400/30 text-green-400 hover:bg-green-400/25' : 'bg-white/5 border-white/20 text-white/50 hover:bg-white/10'}`}>
                {profile?.isOnline ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                {profile?.isOnline ? 'Online' : 'Offline'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Rides', value: profile?.totalRides || 0, color: 'text-blue-400' },
                { label: 'Total Earnings', value: `₹${profile?.totalEarnings?.toFixed(0) || 0}`, color: 'text-yellow-400' },
                { label: 'Rating', value: profile?.rating?.toFixed(1) || '5.0', color: 'text-green-400' },
                { label: 'Status', value: profile?.isOnline ? 'Online' : 'Offline', color: profile?.isOnline ? 'text-green-400' : 'text-white/40' },
              ].map(({ label, value, color }) => (
                <div key={label} className="card">
                  <p className="text-xs text-white/40 mb-1">{label}</p>
                  <p className={`text-3xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Active Rides */}
            <h2 className="text-lg font-bold text-white mb-4">Active Ride Requests</h2>
            {bookings.length === 0 ? (
              <div className="card text-center py-12">
                <Car className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30">No active rides right now.</p>
                {!profile?.isOnline && <p className="text-yellow-400/60 text-sm mt-2">Go online to receive rides</p>}
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="card hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{b.selectedPickupCity} → {b.selectedDropCity}</p>
                        <p className="text-xs text-white/40">{b.userName} · {b.pickupdate} at {b.pickuptime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold">₹{b.fare}</p>
                        <span className={`text-xs ${STATUS_BADGE[b.status]}`}>{b.status}</span>
                      </div>
                    </div>

                    {/* Action buttons based on status */}
                    <div className="flex gap-2 mt-2">
                      {b.status === 'Pending' && (
                        <>
                          <button onClick={() => handleAction(b._id, 'accept')} className="btn-success flex-1 flex items-center justify-center gap-1.5 text-sm py-2">
                            <CheckCircle className="w-4 h-4" /> Accept
                          </button>
                          <button onClick={() => handleAction(b._id, 'reject')} className="btn-danger flex-1 flex items-center justify-center gap-1.5 text-sm py-2">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button onClick={() => handleAction(b._id, 'start')} className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm py-2">
                          <PlayCircle className="w-4 h-4" /> Start Ride
                        </button>
                      )}
                      {b.status === 'In Progress' && (
                        <button onClick={() => handleAction(b._id, 'complete')} className="btn-success flex-1 flex items-center justify-center gap-1.5 text-sm py-2">
                          <CheckCircle className="w-4 h-4" /> Complete Ride
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dhome;
