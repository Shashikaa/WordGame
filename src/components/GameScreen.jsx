import React, { useState, useEffect, useRef } from "react";
import "../Gamescreen.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GameScreen() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [showBananaPopup, setShowBananaPopup] = useState(false);
  const [bananaQuestion, setBananaQuestion] = useState(null);
  const [bananaSolution, setBananaSolution] = useState(null);
  const [bananaAnswer, setBananaAnswer] = useState("");
  const [lives, setLives] = useState(3);
  const [isGameActive, setIsGameActive] = useState(true);
  const [level, setLevel] = useState(1);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const isGameOverNotified = useRef(false);

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
          handleGameOver("Time is up!");
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
      const response = await axios.get(
        "https://api.datamuse.com/words?sp=???"
      );
      const word = response.data[0]?.word; // Get the first word
      if (word) {
        setCurrentWord(word);
        setScrambledWord(scrambleWord(word));
        setHint("");
        setIsHintUsed(false);
      } else {
        toast.error("Failed to retrieve a word. Retrying...");
        fetchWord();
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      toast.error("Failed to fetch word. Please check your connection.");
    }
  };
  

  const scrambleWord = (word) => {
    const scrambled = word.split("").sort(() => Math.random() - 0.5);
    return scrambled.join("");
  };

  const saveScore = async () => {
    try {
      const username = localStorage.getItem("username");
      console.log("Saving score for:", { username, score, level });
  
      const response = await axios.post("http://localhost:5000/api/scores", {
        username,
        score,
        level,
      });
  
      if (response.status === 200) {
        toast.success("Score saved successfully!");
      }
    } catch (error) {
      console.error("Error saving score:", error);
      toast.error("Failed to save score. Try again later.");
    }
  };
  

  
  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === currentWord.toLowerCase()) {
      setScore((prevScore) => prevScore + 10);
      setWordsCompleted((prev) => prev + 1);
      setUserAnswer("");
      toast.success("Correct Answer! Great job!");
  
      // Check if the user completed the level
      if (wordsCompleted + 1 === 2) {
        setLevel((prev) => prev + 1);
        setWordsCompleted(0);
        saveScore(); // Save the score only when the level is completed
        toast.info(`Level up! Welcome to Level ${level + 1}`);
      }
  
      fetchWord();
      setTime(60);
    } else {
      if (lives > 1) {
        toast.error(`Incorrect! Lives remaining: ${lives - 1}`);
      }
      setLives((prevLives) => {
        const newLives = prevLives - 1;
  
        if (newLives <= 0 && !isGameOverNotified.current) {
          isGameOverNotified.current = true; // Prevent multiple notifications
          setShowGameOverPopup(true);
          toast.error("Game Over! You ran out of lives.");
          clearTimer();
        }
  
        return newLives;
      });
    }
  };
  
  
  
  const handleGameOver = (message) => {
    setShowGameOverPopup(true);
    toast.error(message);
  };

  const handleHintClick = () => {
    if (!isHintUsed) {
      clearTimer();
      fetchBananaQuestion();
      setShowBananaPopup(true);
    }
  };

  const fetchBananaQuestion = async () => {
    try {
      const response = await axios.get("https://marcconrad.com/uob/banana/api.php");
      setBananaQuestion(response.data.question);
      setBananaSolution(response.data.solution);
    } catch (error) {
      console.error("Error fetching banana question:", error);
      toast.error("Failed to fetch banana question. Try again later.");
    }
  };

  const submitBananaAnswer = () => {
    if (parseInt(bananaAnswer) === bananaSolution) {
      setShowBananaPopup(false);
      fetchHint();
      toast.success("Correct Banana Answer! Hint revealed.");
    } else {
      toast.error("Incorrect Banana Answer! Try again.");
    }
  };

  const fetchHint = async () => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`
      );
      const definitions = response.data[0].meanings[0].definitions;
      if (definitions.length > 0) {
        setHint(definitions[0].definition);
      } else {
        setHint("No hint available.");
      }
      setShowHintPopup(true);
      setIsHintUsed(true);
      toast.info("Hint has been revealed.");
    } catch (error) {
      console.error("Error fetching hint:", error);
      toast.error("Failed to fetch hint. Please try again later.");
    }
  };
  
  const restartGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setWordsCompleted(0);
    setTime(60);
    setIsGameActive(true);
    setShowGameOverPopup(false);
    isGameOverNotified.current = false; // Reset notification tracker
    fetchWord();
    startTimer();
  };
  

  const closeHintPopup = () => {
    setShowHintPopup(false);
    startTimer();
  };

  const closeBananaPopup = () => {
    setShowBananaPopup(false);
    startTimer();
  };

  
  return (
    <div className="game-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate("/")}>
          Back
        </button>
        <div className="score-info">
          <span>Score: {score}</span>
          <span>Level: {level}</span>
          <span>Words Completed: {wordsCompleted} / 2</span>
          <span>Lives: {lives}</span>
        </div>
      </div>
      <div className="game-play">
        <div className="scramble-box">{scrambledWord || "Loading..."}</div>
        <div className="game-controls">
          <button
            className="hint-button"
            onClick={handleHintClick}
            disabled={isHintUsed}
          >
            {isHintUsed ? "Hint Used" : "Hint"}
          </button>
          <div className="timer">{time}</div>
        </div>
        <input
          type="text"
          placeholder="Type here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="answer-input"
        />
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Hint Popup */}
      {showHintPopup && (
        <div className="popup">
          <h2>Hint</h2>
          <p>{hint}</p>
          <button onClick={closeHintPopup} className="close-button">
            Close
          </button>
        </div>
      )}

      {/* Banana Popup */}
      {showBananaPopup && (
        <div className="popup">
          <h2>Solve Banana Question</h2>
          {bananaQuestion ? (
            <img src={bananaQuestion} alt="Banana Question" />
          ) : (
            <p>Loading...</p>
          )}
          <input
            type="number"
            placeholder="Your Answer"
            value={bananaAnswer}
            onChange={(e) => setBananaAnswer(e.target.value)}
            className="answer-input"
          />
          <div className="popup-buttons">
            <button onClick={submitBananaAnswer} className="submit-button">
              Submit
            </button>
            <button onClick={closeBananaPopup} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Game Over Popup */}
      {showGameOverPopup && (
        <div className="popup">
          <h2>Game Over!</h2>
          <p>Your final score is {score}</p>
          <div className="popup-buttons">
            <button onClick={restartGame} className="restart-button">
              Restart
            </button>
            <button onClick={() => navigate("/")} className="exit-button">
              Exit
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default GameScreen;
