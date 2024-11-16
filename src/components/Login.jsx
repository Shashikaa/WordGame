import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import '../App.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending a request to log in the user with username and password
      const response = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });
      toast.success("Login successful!"); // Show success notification
      console.log("User logged in:", response.data);
      
      // Store JWT token or user session if needed
      localStorage.setItem("token", response.data.token);

      // Redirecting to MainMenu page after successful login
      navigate("/");
    } catch (error) {
      // Show error notification if login fails
      const errorMessage = error.response?.data?.message || error.message;
      if (error.response?.status === 401) {
        toast.error("Incorrect username or password."); // Customize for unauthorized status
      } else {
        toast.error("Login failed: " + errorMessage);
      }
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Sending the Google credential (token) to the backend for Google-based login
      const response = await axios.post("http://localhost:5000/auth/google-login", {
        token: credentialResponse.credential,
      });
      toast.success("Google login successful!");
      console.log("Google User logged in:", response.data);
      
      // Store JWT token or user session if needed
      localStorage.setItem("token", response.data.token);
      
      // Redirecting to MainMenu page after successful Google login
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error.response?.data?.message || error.message);
      toast.error("Google login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="app-container">
      <div className="left-section">
        {/* Add any branding or information here */}
      </div>
      <div className="right-section">
        <h2>Welcome to Word-Scramble</h2>
        <h3>Login</h3>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>

        <p className="txt">Don't have an account? <a href="/register">Register here.</a></p>

        {/* Google login button */}
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.error("Google login failed");
            toast.error("Google login failed!");
          }}
          useOneTap
        />
      </div>
      
      {/* ToastContainer to render the toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default Login;
