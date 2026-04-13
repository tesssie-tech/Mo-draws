import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import AboutUsPage from './AboutUsPage';
import CareersPage from './CareersPage';
import BuildPortfolioPage from './BuildPortfolioPage';
import GuidelinesPage from './GuidelinesPage';
import HelpCentrePage from './HelpCentrePage';
import OurTeamPage from './OurTeamPage';
import AuthModal from './AuthModal';
import './App.css';

function RouteTransitionLoader() {
  const location = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsRouteLoading(true);
    const timer = setTimeout(() => setIsRouteLoading(false), 320);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isRouteLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)'
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          border: '3px solid rgba(255, 255, 255, 0.28)',
          borderTopColor: '#45FFFF',
          borderRadius: '50%',
          animation: 'appRouteSpin 0.8s linear infinite'
        }}
      />
      <style>
        {`@keyframes appRouteSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [isNewUserSession, setIsNewUserSession] = useState(false);
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
    const { isNewUser = false, ...safeUserData } = userData;
    if (isNewUser) {
      localStorage.removeItem('userAvatar');
    }
    setUser(safeUserData);
    setIsNewUserSession(Boolean(isNewUser));
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(safeUserData));
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
    setIsNewUserSession(false);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <BrowserRouter>
      <RouteTransitionLoader />
      <Routes>
        <Route path="*" element={
          <div className="App">
            <style>
              {`
                body, input, p, a, div, button, h1, h2, h3 {
                  font-family: 'Manrope', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                }

                p {
                  color: #45FFFF;
                }

                button {
                  font-weight: bold;
                  letter-spacing: 1px;
                }

                h1, h2, h3 {
                  color: #FF006B;
                }
              `}
            </style>
            {isAuthenticated && user ? (
              <DashboardPage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} isNewUserSession={isNewUserSession} />
            ) : (
              <>
                <LandingPage onLoginClick={() => openAuthModal('login')} onSignUpClick={() => openAuthModal('signup')} />
                <AuthModal isOpen={authModal.isOpen} onClose={closeAuthModal} mode={authModal.mode} onAuthSuccess={handleAuthSuccess} />
              </>
            )}
          </div>
        } />
        <Route path="/aboutuspage" element={<AboutUsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/build-portfolio" element={<BuildPortfolioPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/help-centre" element={<HelpCentrePage />} />
        <Route path="/our-team" element={<OurTeamPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 