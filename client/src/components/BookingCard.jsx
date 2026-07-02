import { MapPin, Calendar, User, Car, CreditCard, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_STYLES = {
  'Pending': 'badge-pending',
  'Confirmed': 'badge-confirmed',
  'On the Way': 'badge-on-way',
  'Arrived': 'badge-on-way',
  'In Progress': 'badge-on-way',
  'Completed': 'badge-completed',
  'Cancelled': 'badge-cancelled',
};

const BookingCard = ({ booking, onDelete, showDelete = true }) => {
  const navigate = useNavigate();
  const badgeClass = STATUS_STYLES[booking.status] || 'badge-pending';

  return (
    <div className="card hover:border-white/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold text-white">
              {booking.selectedPickupCity} → {booking.selectedDropCity}
            </span>
          </div>
          {(booking.pickupAddress || booking.dropAddress) && (
            <p className="text-xs text-white/40 ml-6">
              {booking.pickupAddress && `From: ${booking.pickupAddress}`}
              {booking.pickupAddress && booking.dropAddress && ' · '}
              {booking.dropAddress && `To: ${booking.dropAddress}`}
            </p>
          )}
        </div>
        <span className={badgeClass}>{booking.status}</span>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Booked</p>
          <p className="text-sm text-white font-medium">{booking.bookeddate}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Pickup</p>
          <p className="text-sm text-white font-medium">{booking.pickupdate}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Fare</p>
          <p className="text-sm text-yellow-400 font-bold">₹{booking.fare}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Car</p>
          <p className="text-sm text-white font-medium">{booking.carname}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Type</p>
          <p className="text-sm text-white font-medium">{booking.cartype}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Car No</p>
          <p className="text-sm text-white font-medium">{booking.carno}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Driver</p>
          <p className="text-sm text-white font-medium">{booking.drivername}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Payment</p>
          <p className="text-sm text-white font-medium">{booking.paymentMethod}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-white/40 mb-0.5">Payment Status</p>
          <p className="text-sm text-white font-medium">{booking.paymentStatus}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/receipt/${booking._id}`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <Eye className="w-3.5 h-3.5" /> Receipt
        </button>
        <button
          onClick={() => navigate(`/tracking/${booking._id}`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-all text-sm"
        >
          <MapPin className="w-3.5 h-3.5" /> Track
        </button>
        {showDelete && (
          <button
            onClick={() => onDelete && onDelete(booking._id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
