const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getDashboardStats, getAdminProfile } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/dashboard', protect, checkRole('admin'), getDashboardStats);
router.get('/profile', protect, checkRole('admin'), getAdminProfile);

module.exports = router;
