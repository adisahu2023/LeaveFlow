import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.location.hash.split("=")[1];

    if (token) {
        
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      console.log("token",decodedToken)
      const role = decodedToken.role;

      if (role == "ROLE_EMPLOYEE") {
        navigate("/employee/dashboard");
      } else if (role == "ROLE_MANAGER") {
        navigate("/manager/dashboard");
      } else if (role == "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return <h2>Login successful...</h2>;
}

export default OAuthSuccess;
