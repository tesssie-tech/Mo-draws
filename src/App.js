import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Varela+Round&display=swap');
            
            body, input, p, a, div {
              font-family: 'Varela Round', sans-serif;
            }

            p {
              color: #45FFFF;
            }

            button {
              font-family: 'Varela Round', sans-serif;
              font-weight: bold;
              letter-spacing: 1px;
            }

            h1, h2, h3 {
              font-family: 'Fredoka', sans-serif;
              color: #FF006B;
            }
          `}
        </style>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
