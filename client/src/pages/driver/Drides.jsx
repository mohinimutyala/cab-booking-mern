import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Car, CheckCircle, XCircle, PlayCircle, ChevronDown } from 'lucide-react';

const STATUS_BADGE = {
  'Pending': 'badge-pending', 'Confirmed': 'badge-confirmed',
  'On the Way': 'badge-on-way', 'In Progress': 'badge-on-way',
  'Completed': 'badge-completed', 'Cancelled': 'badge-cancelled',
};

const Drides = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/bookings/driver');
        setBookings(data);
      } catch (err) {
        toast.error('Failed to load rides');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/drivers/ride/${id}/${action}`);
      toast.success(`Ride ${action}ed`);
      const statusMap = { accept: 'Confirmed', reject: 'Cancelled', start: 'In Progress', complete: 'Completed' };
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: statusMap[action] || b.status } : b));
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const filtered = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">All Rides</h1>
            <p className="text-white/40 text-sm">{filtered.length} ride{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="relative">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} 
              className="input appearance-none pr-8 text-sm"
              style={{ backgroundColor: '#111116', colorScheme: 'dark' }}>
              {['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <EmptyState icon={Car} title="No rides found" />
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div key={b._id} className="card hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{b.selectedPickupCity} → {b.selectedDropCity}</p>
                    <p className="text-xs text-white/40">{b.userName || '—'} · {b.pickupdate} at {b.pickuptime}</p>
                    <div className="flex gap-3 mt-1 text-xs text-white/40">
                      <span>Car: <b className="text-white/60">{b.carname}</b></span>
                      <span>No: <b className="font-mono text-white/60">{b.carno}</b></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">₹{b.fare}</p>
                    <span className={STATUS_BADGE[b.status] || 'badge-pending'}>{b.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {b.status === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(b._id, 'accept')} className="btn-success text-xs py-1.5 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button onClick={() => handleAction(b._id, 'reject')} className="btn-danger text-xs py-1.5 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {b.status === 'Confirmed' && (
                    <button onClick={() => handleAction(b._id, 'start')} className="btn-primary text-xs py-1.5 flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5" /> Start Ride
                    </button>
                  )}
                  {b.status === 'In Progress' && (
                    <button onClick={() => handleAction(b._id, 'complete')} className="btn-success text-xs py-1.5 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Drides;
