import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Login to UCab</h1>

        <input
          className="login-input"
          type="tel"
          placeholder="Enter Phone Number"
        />

        <button className="login-btn">
          Send OTP
        </button>

        <input
          className="login-input"
          type="text"
          placeholder="Enter OTP"
        />

        <button className="login-btn">
          Verify OTP & Login
        </button>

      </div>
    </div>
  );
}

export default Login;