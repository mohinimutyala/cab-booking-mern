const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  drivername: { type: String, required: true },
  carImage: { type: String, default: '' },
  carname: { type: String, required: true },
  cartype: { type: String, required: true, enum: ['Mini', 'Sedan', 'SUV', 'Premium', 'Luxury', 'Bike', 'Auto', 'Hatchback'] },
  price: { type: String, required: true },
  carno: { type: String, required: true, unique: true },
  driverRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
