const bcrypt = require('bcryptjs');
const Driver = require('../models/DriverSchema');
const Booking = require('../models/MyBookingSchema');
const generateToken = require('../utils/generateToken');

// @desc  Register driver
// @route POST /api/drivers/register
const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone, licenseNo } = req.body;
    const exists = await Driver.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Driver already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const driver = await Driver.create({ name, email, password: hashed, phone, licenseNo });
    res.status(201).json({
      _id: driver._id, name: driver.name, email: driver.email,
      token: generateToken(driver._id, 'driver'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Login driver
// @route POST /api/drivers/login
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email }).populate('vehicle');
    if (!driver) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, driver.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({
      _id: driver._id, name: driver.name, email: driver.email,
      isOnline: driver.isOnline, vehicle: driver.vehicle,
      token: generateToken(driver._id, 'driver'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all drivers (admin)
// @route GET /api/drivers/all
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password').populate('vehicle');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get driver profile
// @route GET /api/drivers/profile
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select('-password').populate('vehicle');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Toggle online/offline status
// @route PUT /api/drivers/status
const toggleOnlineStatus = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    driver.isOnline = !driver.isOnline;
    await driver.save();
    res.json({ isOnline: driver.isOnline });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get driver earnings
// @route GET /api/drivers/earnings
const getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select('totalEarnings totalRides name');
    const recentRides = await Booking.find({ drivername: driver.name, status: 'Completed' })
      .sort({ createdAt: -1 }).limit(10);
    res.json({ totalEarnings: driver.totalEarnings, totalRides: driver.totalRides, recentRides });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Accept ride
// @route PUT /api/drivers/ride/:id/accept
const acceptRide = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'Confirmed', driverId: req.user.id },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Reject ride
// @route PUT /api/drivers/ride/:id/reject
const rejectRide = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: 'Cancelled' }, { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Start ride
// @route PUT /api/drivers/ride/:id/start
const startRide = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: 'In Progress' }, { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Complete ride
// @route PUT /api/drivers/ride/:id/complete
const completeRide = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: 'Completed', paymentStatus: 'Paid' }, { new: true }
    );
    // Update driver earnings
    const driver = await Driver.findById(req.user.id);
    driver.totalEarnings += parseFloat(booking.fare) || 0;
    driver.totalRides += 1;
    await driver.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete driver (admin)
// @route DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerDriver, loginDriver, getAllDrivers, getDriverProfile,
  toggleOnlineStatus, getEarnings, acceptRide, rejectRide, startRide, completeRide, deleteDriver,
};
