import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

// Register (Email/Password)
export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password });
  return response.data;
};

// Login (Username/Password)
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

// Google Register (For new users registering via Google)
export const googleRegister = async (tokenId) => {
  const response = await axios.post(`${API_URL}/google-register`, { token: tokenId });
  return response.data;
};

// Google Login (For existing users logging in via Google)
export const googleLogin = async (tokenId) => {
  const response = await axios.post(`${API_URL}/google-login`, { token: tokenId });
  return response.data;
};
