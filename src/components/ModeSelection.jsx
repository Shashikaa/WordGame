import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function ModeSelection() {
  const [levels, setLevels] = useState([  
    { level: 1, unlocked: true },
    { level: 2, unlocked: false },
    { level: 3, unlocked: false },
    { level: 4, unlocked: false },
    { level: 5, unlocked: false },
  ]);
  const navigate = useNavigate();

  const handleLevelSelect = (level) => {
    if (level.unlocked) {
      navigate(`/game`);
    }
  };

  return (
    <div className="mode-selection-container">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      <h2>Select Level</h2>
      <ul className="level-list">
        {levels.map((levelData, index) => (
          <li
            key={index}
            className={`level-item ${levelData.unlocked ? 'unlocked' : 'locked'}`}
            onClick={() => handleLevelSelect(levelData)}
          >
            Level {levelData.level}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default ModeSelection;
