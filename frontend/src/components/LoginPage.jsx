import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = jwtDecode(token);
    const role=decodedToken.role;
    if(role=="ROLE_EMPLOYEE"){
      navigate("/employee/dashboard")
    }else if(role=="ROLE_MANAGER"){
      navigate("/manager/dashboard")
    }else if(role=="ROLE_ADMIN"){
      navigate("/admin/dashboard")
    }
  }
}, []);

 const [logData, setData] = useState({
  username: "",
  password: ""
});

function handleChange(e) {
  const { name, value } = e.target;

  setData({
    ...logData,
    [name]: value
  });


}


  async function handleSubmit(event) {
    event.preventDefault()
    console.log(logData)
     try{
      const response = await axios.post(
        "/auth/login",
        logData
      );
      const token = response.data;
      const decodedToken = jwtDecode(token)
      localStorage.setItem("token", token)

      if (decodedToken.role === "ROLE_EMPLOYEE") {
        navigate("/employee/dashboard")
      } else if (decodedToken.role === "ROLE_MANAGER") {
        navigate("/manager/dashboard")
      } else if (decodedToken.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard")
      } else {
        localStorage.removeItem("token")
        alert("This account does not have access to a dashboard in this app.")
      }


  } catch (err) {
       if (err.response) {
      alert("Invalid email or password");
    } else {
      alert("Unable to connect to the backend");
    }

  }
}


  return (
    <main className="simple-login-page">
      <section className="simple-login-card">
        <Link to="/" className="brand simple-login-brand" aria-label="LeaveFlow home">
          <span className="brand-symbol"><i /><i /><i /></span>
          <span>leaveflow<span className="brand-period">.</span></span>
        </Link>
        <h1>Login</h1>
        {location.state?.signupSuccess && <p className="signup-success" role="status">Account created successfully. Please log in.</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" name="username" type="email" onChange={handleChange} value={logData.username} placeholder="Enter your email" autoComplete="email" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" onChange={handleChange} value={logData.password} type="password" placeholder="Enter your password" autoComplete="current-password" required />
          <button type="submit" >Login</button>
        </form>
        <p className="signup-login-link">New to LeaveFlow? <Link to="/signup">Create an account</Link></p>
      </section>
    </main>
  )
}

export default LoginPage
