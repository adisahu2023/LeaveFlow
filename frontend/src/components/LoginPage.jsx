import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      if (role == "ROLE_EMPLOYEE") {
        navigate("/employee/dashboard");
      } else if (role == "ROLE_MANAGER") {
        navigate("/manager/dashboard");
      } else if (role == "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      }
    }
  }, []);

  const [logData, setData] = useState({
    username: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setData({
      ...logData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(logData);
    try {
      const response = await axios.post("/auth/login", logData);
      const token = response.data;
      const decodedToken = jwtDecode(token);
      localStorage.setItem("token", token);

      if (decodedToken.role === "ROLE_EMPLOYEE") {
        navigate("/employee/dashboard");
      } else if (decodedToken.role === "ROLE_MANAGER") {
        navigate("/manager/dashboard");
      } else if (decodedToken.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        localStorage.removeItem("token");
        alert("This account does not have access to a dashboard in this app.");
      }
    } catch (err) {
      if (err.response) {
        alert("Invalid email or password");
      } else {
        alert("Unable to connect to the backend");
      }
    }
  }

  const handleGitHubLogin = () => {
    window.location.href = `${ import.meta.env.VITE_API_URL}/login/oauth2/code/github`;
  };

  const handleGoogleLogin = () => {
      window.location.href = `${ import.meta.env.VITE_API_URL}/login/oauth2/code/google`;
  };

  return (
    <main className="simple-login-page">
      <section className="simple-login-card">
        <Link
          to="/"
          className="brand simple-login-brand"
          aria-label="LeaveFlow home"
        >
          <span className="brand-symbol">
            <i />
            <i />
            <i />
          </span>
          <span>
            leaveflow<span className="brand-period">.</span>
          </span>
        </Link>
        <h1>Login</h1>
        {location.state?.signupSuccess && (
          <p className="signup-success" role="status">
            Account created successfully. Please log in.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="username"
            type="email"
            onChange={handleChange}
            value={logData.username}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            onChange={handleChange}
            value={logData.password}
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button type="submit">Login</button>
          <div className="oauth-divider" aria-hidden="true"><span />or continue with<span /></div>
          <div className="oauth-buttons">
            <button className="oauth-button github-oauth-button" type="button" onClick={handleGitHubLogin}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.29-.5-1.43.11-2.98 0 0 .94-.3 3.06 1.15a10.65 10.65 0 0 1 5.57 0c2.13-1.45 3.06-1.15 3.06-1.15.61 1.55.23 2.69.12 2.98.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" /></svg>
              Continue with GitHub
            </button>
            <button className="oauth-button google-oauth-button" type="button" onClick={handleGoogleLogin}>
              <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.7-.4-4H24v7.6h11a9.4 9.4 0 0 1-4.1 6.2v5h6.7c3.9-3.6 6-8.8 6-14.8Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.1A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.8 27.9a12 12 0 0 1 0-7.8V15H5.9a20 20 0 0 0 0 18l6.9-5.1Z"/><path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.9 15l6.9 5.1c1.6-4.7 6-8.2 11.2-8.2Z"/></svg>
              Continue with Google
            </button>
          </div>
        </form>
        <p className="signup-login-link" type="button">
          New to LeaveFlow? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
