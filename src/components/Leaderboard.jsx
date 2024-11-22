import React, { useState, useEffect } from "react";
import axios from "axios";
import '../App.css';
import { useNavigate } from "react-router-dom";

function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]); // State to store the scores

  // Fetch scores from the backend on component mount
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/scores/leaderboard");
        setScores(response.data); // Store the leaderboard data
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };
    
    fetchScores();
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleBack = () => {
    navigate("/"); // Navigate to the home page or any other route you specify
  };

  return (
    <div className="leaderboard-container">
      <button className="back-button" onClick={handleBack}>Back</button>
      <h2>Leaderboard</h2>
      <div className="score-list">
        {scores.map((user, index) => (
          <div key={index} className="score-item">
            <span>{index + 1}. {user.username}</span> {/* Display rank */}
            <span>{user.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;

