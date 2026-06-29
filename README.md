# cab-booking-mern
Project Overview

cab-booking  is a MERN Stack based cab booking application designed to simplify the process of booking rides for passengers while providing efficient ride management for drivers and administrators.

The platform allows users to register, log in securely using JWT authentication, select pickup and drop locations, choose cab types, schedule rides, manage bookings, and view booking history through an easy-to-use interface.

Domain

Transportation

Technology Stack
Frontend
React.js
HTML
CSS
JavaScript
Backend
Node.js
Express.js
Database
MongoDB
Mongoose ODM
Authentication
JSON Web Token (JWT)
bcrypt.js
Features
User Features
User Registration and Login
JWT Authentication
Cab Booking
Cab Type Selection
Scheduled Booking
Booking Cancellation
Booking History
Receipt Download
Driver Features
Driver Login
View Assigned Rides
Accept or Reject Ride Requests
Update Ride Status
View Ride History
Admin Features
Manage Users
Manage Drivers
Manage Vehicle Categories
Monitor Bookings
View Reports and Analytics
Project Architecture

The application follows the MVC (Model View Controller) architecture.

Client (React.js)
        ↓
REST API (Express.js)
        ↓
Business Logic (Controllers)
        ↓
MongoDB Database (Mongoose)
Project Structure
ucab-cab-booking/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── README.md
└── .gitignore
Installation
Clone Repository
git clone https://github.com/your-username/ucab-cab-booking.git
Install Frontend Dependencies
cd client
npm install
Install Backend Dependencies
cd ../server
npm install
Environment Variables

Create a .env file inside the server folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run Application
Start Backend
cd server
npm run dev
Start Frontend
cd client
npm start

The frontend will run on:

http://localhost:3000

The backend will run on:

http://localhost:5000
Future Enhancements
Real-time GPS Tracking
Online Payment Gateway
Driver Ratings and Reviews
Promo Codes and Discounts
Ride Sharing Feature
Team Members
Mutyala Mohini Sri Mani (Team Lead)
Navya Paluri
Sai Purnadevi Surada
Pushpalatha Chimmili
Mohammad Rafiunnisa
License

This project is developed for the NASSCOM Full Stack Developer MERN Stack Internship Program
