import "../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">

      <nav className="navbar">
        <h1 className="logo">UCab</h1>

        <div className="nav-buttons">
          <Link to="/login">
            <button className="nav-btn">Login</button>
          </Link>

          <Link to="/register">
            <button className="nav-btn">Register</button>
          </Link>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-content">
          <h1>Book Your Ride Anytime, Anywhere</h1>

          <p>
            Fast, safe and affordable rides with real-time tracking and easy booking.
          </p>

          <button className="book-btn">
            Book Your Ride
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/744/744465.png"
            alt="Cab"
          />
        </div>

      </section>

      <section className="features">
        <h2>Why Choose UCab?</h2>

        <div className="feature-cards">

          <div className="card">
            <h3>24/7 Availability</h3>
            <p>Book a ride whenever you need it.</p>
          </div>

          <div className="card">
            <h3>Safe Rides</h3>
            <p>Verified drivers and secure journeys.</p>
          </div>

          <div className="card">
            <h3>Live Tracking</h3>
            <p>Track your cab in real time.</p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;