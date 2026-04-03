import React, { useState } from 'react';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import AuthModal from './AuthModal';
import './App.css';

function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    closeAuthModal();
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
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
      {isAuthenticated && user ? (
        <DashboardPage user={user} onLogout={handleLogout} />
      ) : (
        <>
          <LandingPage onLoginClick={() => openAuthModal('login')} onSignUpClick={() => openAuthModal('signup')} />
          <AuthModal isOpen={authModal.isOpen} onClose={closeAuthModal} mode={authModal.mode} onAuthSuccess={handleAuthSuccess} />
        </>
      )}
    </div>
  );
}

export default App;
