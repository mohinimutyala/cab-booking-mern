const Booking = require('../models/MyBookingSchema');
const Car = require('../models/CarSchema');
const { calculateFare } = require('../services/fareService');

// @desc  Create booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      selectedPickupState, selectedPickupCity, pickupAddress,
      selectedDropState, selectedDropCity, dropAddress,
      pickupdate, pickuptime,
      carId, paymentMethod, isScheduled, notes,
    } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const fareData = calculateFare(selectedPickupCity, selectedDropCity, car.cartype);

    const booking = await Booking.create({
      selectedPickupState: selectedPickupState || 'South India',
      selectedPickupCity,
      pickupAddress: pickupAddress || '',
      selectedDropState: selectedDropState || 'South India',
      selectedDropCity,
      dropAddress: dropAddress || '',
      pickupdate, pickuptime,
      drivername: car.drivername,
      driverId: car.driverRef,
      fare: fareData.totalFare.toString(),
      carname: car.carname,
      cartype: car.cartype,
      carno: car.carno,
      price: car.price,
      userId: req.user.id,
      userName: req.body.userName || '',
      carId,
      paymentMethod: paymentMethod || 'Cash',
      isScheduled: isScheduled || false,
      notes: notes || '',
    });

    res.status(201).json({ booking, fareData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Calculate fare (preview)
// @route POST /api/bookings/calculate-fare
const calculateFarePreview = async (req, res) => {
  try {
    const { pickupCity, dropCity, cartype } = req.body;
    if (!pickupCity || !dropCity || !cartype)
      return res.status(400).json({ message: 'pickupCity, dropCity, cartype are required' });
    const result = calculateFare(pickupCity, dropCity, cartype);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get my bookings
// @route GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all bookings (admin)
// @route GET /api/bookings/all
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get booking by ID
// @route GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete booking
// @route DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update booking status
// @route PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get driver bookings (driver)
// @route GET /api/bookings/driver
const getDriverBookings = async (req, res) => {
  try {
    // Match by driverId (ObjectId) first, fallback to drivername string
    const bookings = await Booking.find({
      $or: [
        { driverId: req.user.id },
        { drivername: req.user.name },
      ]
    }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking, calculateFarePreview, getMyBookings, getAllBookings,
  getBookingById, deleteBooking, updateBookingStatus, getDriverBookings,
};
