import "../styles/Register.css";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="register-container">
      <div className="register-card">

        <h1>Create Your UCab Account</h1>

        <input
          className="register-input"
          type="text"
          placeholder="Full Name"
        />

        <input
          className="register-input"
          type="tel"
          placeholder="Phone Number"
        />

        <button className="register-btn">
          Send OTP
        </button>

        <input
          className="register-input"
          type="text"
          placeholder="Enter OTP"
        />

        <button className="register-btn">
          Verify OTP & Register
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;