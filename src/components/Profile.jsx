import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

function Profile() {
  const [user, setUser] = useState({
    email: "",
    username: "",
    photo: "", 
  });
  const [editedUser, setEditedUser] = useState(user); // State for edited user info
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token is missing. Please log in again.");
          return;
        }

        const response = await axios.get("http://localhost:5000/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setEditedUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token is missing. Please log in again.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/auth/user",
        editedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  return (
    <div className="profile-container animated-container">
      <div className="profile-card animated-card">
        <h2 className="profile-header">My Profile</h2>

        <div className="profile-photo-container">
          <img
            src={user.photo || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-photo animated-photo"
          />
        </div>

        {!isEditing ? (
          <div className="profile-info">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <button
              className="edit-button animated-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <input
              type="email"
              placeholder="Email"
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={editedUser.username}
              onChange={(e) =>
                setEditedUser({ ...editedUser, username: e.target.value })
              }
              required
            />
            <div className="button-group">
              <button type="submit" className="update-button animated-button">
                Save
              </button>
              <button
                type="button"
                className="cancel-button animated-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <button onClick={handleLogout} className="logout-button animated-button">
          Logout
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Profile;
