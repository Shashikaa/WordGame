import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import GoogleOAuthProvider
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import ModeSelection from './components/ModeSelection';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  return (
    // Wrap the entire app in GoogleOAuthProvider
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>

      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/mode-selection" element={<ModeSelection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
