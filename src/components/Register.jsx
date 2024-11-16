import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import '../App.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import toastify components
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Sending a request to register the user via email and password
      const response = await axios.post("http://localhost:5000/auth/register", {
        email,
        username,
        password,
      });
      toast.success("Registration successful!"); // Show success message

      // Wait a moment before navigating to login page
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 3000); // Adjust the delay (in milliseconds) as needed
      
      console.log("User registered:", response.data);
    } catch (error) {
      console.error("Registration error:", error.response?.data?.message || error.message);
      toast.error("Registration failed: " + (error.response?.data?.message || error.message)); // Show error message
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      // Sending the Google credential (token) to the backend for Google-based signup
      const response = await axios.post("http://localhost:5000/auth/google-register", {
        token: credentialResponse.credential, // Ensure it matches backend expectation
      });
      toast.success("Google signup successful!"); // Show success message

      // Wait a moment before navigating to login page
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 3000); // Adjust the delay as needed

      console.log("Google User registered:", response.data);
    } catch (error) {
      console.error("Google signup error:", error.response?.data?.message || error.message);
      toast.error("Google signup failed: " + (error.response?.data?.message || error.message)); // Show error message
    }
  };

  return (
    <div className="app-container">
      <div className="left-section">
        {/* Add any branding or information here */}
      </div>
      <div className="right-section">
        <h2>Welcome to Word-Scramble</h2>
        <h3>Register</h3>
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
          <button type="submit" className="register-button">Register</button>
        </form>

        <p className="txt">Already have an account? <a href="/login">Login here.</a></p>

        {/* Google login button */}
        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => {
            console.error("Google signup failed");
            toast.error("Google signup failed!"); // Show error message for Google signup failure
          }}
          useOneTap
        />
      </div>
      
      {/* ToastContainer component to render the toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default Register;
