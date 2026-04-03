import React, { useState } from 'react';
import LandingPage from './LandingPage';
import AuthModal from './AuthModal';
import './App.css';

function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
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
      <LandingPage onLoginClick={() => openAuthModal('login')} onSignUpClick={() => openAuthModal('signup')} />
      <AuthModal isOpen={authModal.isOpen} onClose={closeAuthModal} mode={authModal.mode} />
    </div>
  );
}

export default App;
