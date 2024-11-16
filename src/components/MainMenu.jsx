// src/components/MainMenu.js
import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="button-container">
        <button className="menu-button" onClick={() => navigate('/profile')}>Profile</button>
        <button className="menu-button" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
        <button className="menu-button" onClick={() => navigate('/mode-selection')}>Play</button>
      </div>
      
    </div>
  );
};

export default MainMenu;

