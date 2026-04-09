import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import AboutUsPage from './AboutUsPage';
import AuthModal from './AuthModal';
import './App.css';

function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    document.title = "Mo-Draws";
    
    // Dynamically change the favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    // Set an Artist Palette emoji as the favicon
    link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>";
  }, []);

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    closeAuthModal();
  };

  const handleUpdateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={
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
              <DashboardPage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
            ) : (
              <>
                <LandingPage onLoginClick={() => openAuthModal('login')} onSignUpClick={() => openAuthModal('signup')} />
                <AuthModal isOpen={authModal.isOpen} onClose={closeAuthModal} mode={authModal.mode} onAuthSuccess={handleAuthSuccess} />
              </>
            )}
          </div>
        } />
        <Route path="/aboutuspage" element={<AboutUsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 