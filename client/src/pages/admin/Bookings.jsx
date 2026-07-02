import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { BookOpen, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'On the Way', 'Arrived', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_BADGE = {
  'Pending': 'badge-pending', 'Confirmed': 'badge-confirmed',
  'On the Way': 'badge-on-way', 'Arrived': 'badge-on-way',
  'In Progress': 'badge-on-way', 'Completed': 'badge-completed', 'Cancelled': 'badge-cancelled',
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/all');
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking deleted');
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: data.status } : b));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">Bookings</h1>
          <p className="text-white/40 text-sm">{bookings.length} total bookings</p>
        </div>

        {loading ? <Loader /> : bookings.length === 0 ? (
          <EmptyState icon={BookOpen} title="No bookings yet" />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="card hover:border-white/20 transition-all">
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-white">{b.selectedPickupCity} → {b.selectedDropCity}</p>
                    <p className="text-xs text-white/40">{b.userName || '—'} · {b.bookeddate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 font-bold">₹{b.fare}</span>
                    <span className={STATUS_BADGE[b.status] || 'badge-pending'}>{b.status}</span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs text-white/50">
                  <span>Car: <b className="text-white/70">{b.carname}</b></span>
                  <span>Type: <b className="text-white/70">{b.cartype}</b></span>
                  <span>Car No: <b className="text-white/70">{b.carno}</b></span>
                  <span>Driver: <b className="text-white/70">{b.drivername}</b></span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="input text-xs py-1.5 pr-6 appearance-none"
                      style={{ backgroundColor: '#111116', colorScheme: 'dark' }}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                  </div>
                  <button onClick={() => handleDelete(b._id)} className="btn-danger text-xs py-1.5">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookings;
