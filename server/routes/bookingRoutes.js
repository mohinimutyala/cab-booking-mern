const express = require('express');
const router = express.Router();
const {
  createBooking, calculateFarePreview, getMyBookings, getAllBookings,
  getBookingById, deleteBooking, updateBookingStatus, getDriverBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.post('/calculate-fare', calculateFarePreview);
router.post('/', protect, checkRole('user'), createBooking);
router.get('/my', protect, checkRole('user'), getMyBookings);
router.get('/driver', protect, checkRole('driver'), getDriverBookings);
router.get('/all', protect, checkRole('admin'), getAllBookings);
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, deleteBooking);
router.put('/:id/status', protect, checkRole('admin'), updateBookingStatus);

module.exports = router;
