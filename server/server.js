const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./db/connectDB');
const { errorMiddleware, notFound } = require('./middlewares/errorMiddleware');

// Load env
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'CabGo API Running' }));

// Dev-only seed endpoint (reuses existing Atlas connection)
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/seed', async (req, res) => {
    try {
      const bcrypt = require('bcryptjs');
      const Admin = require('./models/AdminSchema');
      const User = require('./models/UserSchema');
      const Car = require('./models/CarSchema');
      const Driver = require('./models/DriverSchema');
      const Booking = require('./models/MyBookingSchema');

      await Promise.all([Admin.deleteMany(), User.deleteMany(), Car.deleteMany(), Driver.deleteMany(), Booking.deleteMany()]);
      const hash = (pw) => bcrypt.hash(pw, 10);

      await Admin.create({ name: 'Super Admin', email: 'admin@cabgo.com', password: await hash('admin123') });

      const users = await User.create([
        { name: 'Priya Sharma', email: 'priya@example.com', password: await hash('user123'), phone: '9876543210' },
        { name: 'Rahul Verma', email: 'rahul@example.com', password: await hash('user123'), phone: '9876543211' },
        { name: 'Ananya Patel', email: 'ananya@example.com', password: await hash('user123'), phone: '9876543212' },
      ]);

      const drivers = await Driver.create([
        { name: 'Pooja Singh', email: 'pooja@cabgo.com', password: await hash('driver123'), phone: '9001234561', licenseNo: 'MH01234', isOnline: true },
        { name: 'Rahul Mehta', email: 'rahulmehta@cabgo.com', password: await hash('driver123'), phone: '9001234562', licenseNo: 'KA05678', isOnline: true },
        { name: 'Sneha Kapoor', email: 'sneha@cabgo.com', password: await hash('driver123'), phone: '9001234563', licenseNo: 'RJ09012', isOnline: false },
        { name: 'Arjun Das', email: 'arjun@cabgo.com', password: await hash('driver123'), phone: '9001234564', licenseNo: 'DL03456', isOnline: true },
        { name: 'Meera Nair', email: 'meera@cabgo.com', password: await hash('driver123'), phone: '9001234565', licenseNo: 'TN07890', isOnline: false },
      ]);

      const cars = await Car.create([
        { drivername: 'Pooja Singh',  carname: 'Maruti Swift',  cartype: 'Hatchback', price: '10', carno: 'MH 12 XY 5678', isAvailable: true, driverRef: drivers[0]._id, carImage: 'http://localhost:5000/uploads/hatchback.png' },
        { drivername: 'Rahul Mehta',  carname: 'Honda City',   cartype: 'Sedan',     price: '14', carno: 'KA 05 CD 9013', isAvailable: true, driverRef: drivers[1]._id, carImage: 'http://localhost:5000/uploads/sedan.png' },
        { drivername: 'Sneha Kapoor', carname: 'Toyota Etios', cartype: 'Sedan',     price: '12', carno: 'RJ 14 QW 3456', isAvailable: true, driverRef: drivers[2]._id, carImage: 'http://localhost:5000/uploads/sedan.png' },
        { drivername: 'Arjun Das',    carname: 'Mahindra XUV', cartype: 'SUV',       price: '18', carno: 'DL 04 AB 7890', isAvailable: true, driverRef: drivers[3]._id, carImage: 'http://localhost:5000/uploads/suv.png' },
        { drivername: 'Meera Nair',   carname: 'Ola Electric', cartype: 'Mini',      price: '7',  carno: 'TN 07 CD 1234', isAvailable: true, driverRef: drivers[4]._id, carImage: 'http://localhost:5000/uploads/mini.png' },
        { drivername: 'Pooja Singh',  carname: 'Hero Splendor', cartype: 'Bike',     price: '5',  carno: 'MH 13 XZ 9876', isAvailable: true, driverRef: drivers[0]._id, carImage: 'http://localhost:5000/uploads/bike.png' },
        { drivername: 'Arjun Das',    carname: 'BMW 5 Series', cartype: 'Luxury',    price: '30', carno: 'DL 05 MN 5678', isAvailable: true, driverRef: drivers[3]._id, carImage: 'http://localhost:5000/uploads/luxury.png' },
        { drivername: 'Rahul Mehta',  carname: 'Honda City',   cartype: 'Sedan',     price: '10', carno: 'KA 05 CD 9012', isAvailable: true, driverRef: drivers[1]._id, carImage: 'http://localhost:5000/uploads/sedan.png' },
      ]);

      // Link primary vehicle to each driver
      await Driver.findByIdAndUpdate(drivers[0]._id, { vehicle: cars[0]._id });
      await Driver.findByIdAndUpdate(drivers[1]._id, { vehicle: cars[1]._id });
      await Driver.findByIdAndUpdate(drivers[2]._id, { vehicle: cars[2]._id });
      await Driver.findByIdAndUpdate(drivers[3]._id, { vehicle: cars[3]._id });
      await Driver.findByIdAndUpdate(drivers[4]._id, { vehicle: cars[4]._id });

      const today = new Date().toISOString().split('T')[0];
      await Booking.create([
        { selectedPickupState: 'Maharashtra', selectedPickupCity: 'Mumbai', selectedDropState: 'Maharashtra', selectedDropCity: 'Pune', pickupdate: today, pickuptime: '10:00', drivername: 'Pooja Singh', driverId: drivers[0]._id, fare: '450', carname: 'Maruti Swift', cartype: 'Hatchback', carno: 'MH 12 XY 5678', price: '10', userId: users[0]._id, userName: 'Priya Sharma', carId: cars[0]._id, paymentMethod: 'Cash', status: 'Pending', bookeddate: today },
        { selectedPickupState: 'Karnataka', selectedPickupCity: 'Bangalore', selectedDropState: 'Tamil Nadu', selectedDropCity: 'Chennai', pickupdate: today, pickuptime: '14:00', drivername: 'Pooja Singh', driverId: drivers[0]._id, fare: '820', carname: 'Maruti Swift', cartype: 'Hatchback', carno: 'MH 12 XY 5678', price: '10', userId: users[1]._id, userName: 'Rahul Verma', carId: cars[0]._id, paymentMethod: 'UPI', status: 'Confirmed', bookeddate: today },
        { selectedPickupState: 'Delhi', selectedPickupCity: 'New Delhi', selectedDropState: 'Rajasthan', selectedDropCity: 'Jaipur', pickupdate: today, pickuptime: '08:00', drivername: 'Arjun Das', driverId: drivers[3]._id, fare: '900', carname: 'Mahindra XUV', cartype: 'SUV', carno: 'DL 04 AB 7890', price: '18', userId: users[2]._id, userName: 'Ananya Patel', carId: cars[3]._id, paymentMethod: 'Card', status: 'Completed', bookeddate: today },
        { selectedPickupState: 'Telangana', selectedPickupCity: 'Hyderabad', selectedDropState: 'Maharashtra', selectedDropCity: 'Mumbai', pickupdate: today, pickuptime: '16:00', drivername: 'Rahul Mehta', driverId: drivers[1]._id, fare: '1200', carname: 'Honda City', cartype: 'Sedan', carno: 'KA 05 CD 9013', price: '14', userId: users[0]._id, userName: 'Priya Sharma', carId: cars[1]._id, paymentMethod: 'Cash', status: 'Pending', bookeddate: today },
      ]);

      res.json({ success: true, message: 'Database seeded successfully!' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}

// Error handlers
app.use(notFound);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));
