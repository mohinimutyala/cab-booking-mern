const bcrypt = require('bcryptjs');
const Admin = require('../models/AdminSchema');
const User = require('../models/UserSchema');
const Car = require('../models/CarSchema');
const Booking = require('../models/MyBookingSchema');
const Driver = require('../models/DriverSchema');
const generateToken = require('../utils/generateToken');

// @desc  Register admin
// @route POST /api/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });
    res.status(201).json({
      _id: admin._id, name: admin.name, email: admin.email,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Login admin
// @route POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({
      _id: admin._id, name: admin.name, email: admin.email,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get dashboard stats
// @route GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [users, cabs, bookings, drivers] = await Promise.all([
      User.countDocuments(),
      Car.countDocuments(),
      Booking.countDocuments(),
      Driver.countDocuments(),
    ]);
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
    const completedBookings = await Booking.find({ status: 'Completed' });
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (parseFloat(b.fare) || 0), 0);

    // Monthly booking counts for analytics
    const monthlyData = await Booking.aggregate([
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]);

    res.json({ users, cabs, bookings, drivers, totalRevenue, recentBookings, monthlyData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get admin profile
// @route GET /api/admin/profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerAdmin, loginAdmin, getDashboardStats, getAdminProfile };
