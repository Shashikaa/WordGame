import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Navigate to the home page or any other route you specify
  };

  const users = [
    { name: 'User1', score: 100 },
    { name: 'User51', score: 95 },
    { name: 'User11', score: 90 },
    { name: 'User5', score: 70 },
    { name: 'You', score: 0 },
  ];

  return (
    <div className="leaderboard-container">
      <button className="back-button" onClick={handleBack}>Back</button>
      <h2>Leaderboard</h2>
      <div className="score-list">
        {users.map((user, index) => (
          <div key={index} className="score-item">
            <span>{user.name}</span>
            <span>{user.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;

