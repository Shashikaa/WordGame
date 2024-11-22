// src/components/Button.js
import React from 'react';
import './Button.css';

const Button = ({ label, onClick, styleClass }) => {
  return (
    <button className={`custom-button ${styleClass}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
