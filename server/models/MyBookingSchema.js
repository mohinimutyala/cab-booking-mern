const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  selectedPickupState: { type: String, default: 'South India' },
  selectedPickupCity: { type: String, required: true },
  pickupAddress: { type: String, default: '' },
  selectedDropState: { type: String, default: 'South India' },
  selectedDropCity: { type: String, required: true },
  dropAddress: { type: String, default: '' },
  pickupdate: { type: String, required: true },
  pickuptime: { type: String, required: true },
  dropdate: { type: String },
  droptime: { type: String },
  drivername: { type: String },
  fare: { type: String },
  carname: { type: String },
  cartype: { type: String },
  carno: { type: String },
  price: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  bookeddate: {
    type: String,
    default: () => new Date().toLocaleDateString('hi-IN'),
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'On the Way', 'Arrived', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI'],
    default: 'Cash',
  },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  isScheduled: { type: Boolean, default: false },
  notes: { type: String, default: '' },
}, { timestamps: true });

const Mybookings = mongoose.model('Mybookings', rideSchema);
module.exports = Mybookings;
