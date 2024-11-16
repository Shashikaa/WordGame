import React, { useState, useEffect, useRef } from 'react';
import '../Gamescreen.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GameScreen() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [level, setLevel] = useState(1);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameActive, setIsGameActive] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isGameActive) {
      fetchWord();
      startTimer();
    }
    return () => clearTimer();
  }, [isGameActive]);

  const startTimer = () => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearTimer();
          handleGameOver('Time is up!');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const fetchWord = async () => {
    try {
      const response = await axios.get('https://random-word-api.herokuapp.com/word?length=4');
      const word = response.data[0];
      if (word) {
        setCurrentWord(word);
        setScrambledWord(scrambleWord(word));
        setHint('');
        setIsHintUsed(false);
      } else {
        setScrambledWord('Error: No word found');
      }
    } catch (error) {
      console.error('Error fetching word:', error);
      setScrambledWord('Error fetching word');
    }
  };

  const scrambleWord = (word) => {
    if (!word) return '';
    let scrambled = word.split('');
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled.join('');
  };

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleHintClick = async () => {
    if (isHintUsed || !currentWord) return;
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`);
      const definitions = response.data[0]?.meanings?.[0]?.definitions;
      if (definitions && definitions.length > 0) {
        const hintText = definitions[0].definition;
        setHint(hintText);
        setIsHintUsed(true);
      } else {
        setHint('No hint available for this word.');
      }
      setShowHintPopup(true);
    } catch (error) {
      console.error('Error fetching hint:', error);
      setHint('Error fetching hint. Please try again later.');
      setShowHintPopup(true);
    }
  };

  const closeHintPopup = () => {
    setShowHintPopup(false);
  };

  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === currentWord.toLowerCase()) {
      setScore((prevScore) => prevScore + 10);
      setWordsCompleted((prevWords) => prevWords + 1);
      setUserAnswer('');
      if (wordsCompleted + 1 === level * 5) {
        setLevel(level + 1);
        setWordsCompleted(0);
        alert(`Level ${level} completed! Moving to Level ${level + 1}`);
      }
      fetchWord();
      setTime(30);
    } else {
      setLives((prevLives) => prevLives - 1);
      if (lives - 1 <= 0) {
        handleGameOver('Incorrect Answer!');
      }
    }
  };

  const handleGameOver = (message) => {
    setPopupMessage(`${message} You have ${lives - 1} lives left.`);
    setShowPopup(true);
    setIsGameActive(false);
    clearTimer();
  };

  const handleRestartGame = () => {
    setIsGameActive(true);
    setTime(40);
    setWordsCompleted(0);
    setScore(0);
    setLives(3);
    setLevel(1);
    setShowPopup(false);
    fetchWord();
    startTimer();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleExitToMainMenu = () => {
    navigate('/');
  };

  return (
    <div className="game-container" >
      <div className="header">
        {/* Back Button */}
        <button className="back-button" onClick={handleBack}>Back</button>

        {/* Score, Level, Words Completed, and Lives in one row */}
        <div className="score-info">
          <span className="stat-item">Score: {score}</span>
          <span className="stat-item">Level: {level}</span>
          <span className="stat-item">Words Completed: {wordsCompleted} / {level * 5}</span>
          <span className="stat-item">Lives: {lives}</span>
        </div>
      </div>

      <div className="game-play">
        <div className="scramble-box">
          {scrambledWord || 'Loading...'}
        </div>

        <div className="game-controls">
          <button className="hint-button" onClick={handleHintClick} disabled={isHintUsed}>
            {isHintUsed ? 'Hint Used' : 'Hint'}
          </button>
          <div className="timer">{time}</div>
        </div>

        <input
          type="text"
          className="answer-input"
          placeholder="Type here..."
          value={userAnswer}
          onChange={handleAnswerChange}
        />

        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>

      {showHintPopup && (
        <div className="popup">
          <h2>Hint</h2>
          <p className="hint">{hint}</p>
          <button className="close-button" onClick={closeHintPopup}>Close</button>
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <h2>{popupMessage}</h2>
          <button onClick={handleRestartGame}>Restart Game</button>
          <button className="exit-button" onClick={handleExitToMainMenu}>Exit to Main Menu</button>
        </div>
      )}
    </div>
  );
}

export default GameScreen;
