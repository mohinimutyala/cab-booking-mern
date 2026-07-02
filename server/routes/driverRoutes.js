const express = require('express');
const router = express.Router();
const {
  registerDriver, loginDriver, getAllDrivers, getDriverProfile,
  toggleOnlineStatus, getEarnings, acceptRide, rejectRide, startRide, completeRide, deleteDriver,
} = require('../controllers/driverController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.get('/all', protect, checkRole('admin'), getAllDrivers);
router.get('/profile', protect, checkRole('driver'), getDriverProfile);
router.put('/status', protect, checkRole('driver'), toggleOnlineStatus);
router.get('/earnings', protect, checkRole('driver'), getEarnings);
router.put('/ride/:id/accept', protect, checkRole('driver'), acceptRide);
router.put('/ride/:id/reject', protect, checkRole('driver'), rejectRide);
router.put('/ride/:id/start', protect, checkRole('driver'), startRide);
router.put('/ride/:id/complete', protect, checkRole('driver'), completeRide);
router.delete('/:id', protect, checkRole('admin'), deleteDriver);

module.exports = router;
