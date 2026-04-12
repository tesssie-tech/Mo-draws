import React, { useState, useRef, useEffect } from 'react';
import VerificationModal from './VerificationModal';

const AuthModal = ({ isOpen, onClose, mode, onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentMode, setCurrentMode] = useState(mode);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [toastMessage, setToastMessage] = useState(null);
  const [isToastClosing, setIsToastClosing] = useState(false);
  const toastTimeoutRef = useRef(null);
  const toastCloseTimeoutRef = useRef(null);

  const closeToast = () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (toastCloseTimeoutRef.current) clearTimeout(toastCloseTimeoutRef.current);
    setIsToastClosing(true);
    toastCloseTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setIsToastClosing(false);
    }, 300);
  };

  const showToast = (message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (toastCloseTimeoutRef.current) clearTimeout(toastCloseTimeoutRef.current);
    setToastMessage(message);
    setIsToastClosing(false);
    toastTimeoutRef.current = setTimeout(closeToast, 3000);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address');
      return;
    }

    if (currentMode === 'forgot_password') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        showToast(`Password reset link sent to ${email}`);
        setCurrentMode('login');
      }, 1000); // Simulate network request delay
      return;
    }
    if (currentMode === 'signup') {
      if (name.trim().split(/\s+/).length < 2) {
        showToast('Please enter your full name (first and last name)');
        return;
      }
      if (password.length < 8) {
        showToast('Password must be at least 8 characters long');
        return;
      }
      if (!/\d/.test(password)) {
        showToast('Password must contain at least one number');
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(password)) {
        showToast('Password must contain at least one special character');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Show verification modal for signup
        setSignupEmail(email);
        setSignupName(name);
        setShowVerification(true);
        console.log('Signup initiated:', { name, email, password });
      }, 1000); // Simulate network request delay
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        console.log('Login:', email, password);
        onAuthSuccess({ name: email.split('@')[0], email });
      }, 1000); // Simulate network request delay
    }
  };

  const handleVerification = (code) => {
    console.log('Verification code submitted:', code);
    showToast('Account verified successfully! Welcome to Mo-Draws!');
    resetForm();
    setShowVerification(false);
    setTimeout(() => {
      onAuthSuccess({ name: signupName, email: signupEmail, isNewUser: true });
    }, 2000); // Allow time for toast notification to be read before unmounting the modal
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSignupEmail('');
    setSignupName('');
  };

  if (!isOpen) return null;

  const isLogin = currentMode === 'login';
  const isSignup = currentMode === 'signup';
  const isForgot = currentMode === 'forgot_password';

  return (
    <div 
      onClick={handleCloseModal}
      style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: isClosing ? 'backdropFadeOut 0.3s ease forwards' : 'backdropFadeIn 0.3s ease forwards'
    }}>
      <style>
        {`
          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes backdropFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes modalContentFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes modalContentFadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
          @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes toastSlideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(50px); }
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
        backgroundColor: '#1a1a1a',
        border: '2px solid #857AFF',
        borderRadius: '15px',
        padding: isMobile ? '25px' : '40px',
        width: isMobile ? '95%' : '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(133, 122, 255, 0.3)',
        position: 'relative',
        animation: isClosing ? 'modalContentFadeOut 0.3s ease forwards' : 'modalContentFadeIn 0.3s ease forwards'
      }}>
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          style={{
            position: 'absolute',
            top: isMobile ? '10px' : '15px',
            right: isMobile ? '10px' : '15px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FF006B',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h2 style={{ textAlign: 'center', color: '#FF006B', marginTop: 0, marginBottom: isForgot ? (isMobile ? '10px' : '15px') : (isMobile ? '20px' : '30px'), fontSize: isMobile ? '1.8em' : '2em' }}>
          {isLogin ? 'Login to Mo-Draws' : isSignup ? 'Sign Up for Mo-Draws' : 'Reset Password'}
        </h2>

        {isForgot && (
          <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '20px', fontSize: '14px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div style={{ marginBottom: '15px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignup}
                style={{
                  width: '100%',
                  padding: isMobile ? '10px 35px 10px 10px' : '12px 35px 12px 12px',
                  border: '1px solid #857AFF',
                  borderRadius: '8px',
                  backgroundColor: '#111',
                  color: 'white',
                  fontSize: isMobile ? '16px' : '14px',
                  boxSizing: 'border-box'
                }}
              />
              {name.trim().split(/\s+/).length >= 2 && (
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  top: isMobile ? '12px' : '14px',
                  color: '#45FFEF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'modalContentFadeIn 0.2s ease-out'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: isMobile ? '10px 35px 10px 10px' : '12px 35px 12px 12px',
                border: '1px solid #857AFF',
                borderRadius: '8px',
                backgroundColor: '#111',
                color: 'white',
                fontSize: isMobile ? '16px' : '14px',
                boxSizing: 'border-box'
              }}
            />
            {email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
              <div style={{
                position: 'absolute',
                right: '10px',
                top: isMobile ? '12px' : '14px',
                color: '#45FFEF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'modalContentFadeIn 0.2s ease-out'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            )}
          </div>

      {!isForgot && (
        <div style={{ marginBottom: '15px', position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: isMobile ? '10px 40px 10px 10px' : '12px 40px 12px 12px',
              border: '1px solid #857AFF',
              borderRadius: '8px',
              backgroundColor: '#111',
              color: 'white',
              fontSize: isMobile ? '16px' : '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: isMobile ? '9px' : '11px',
              background: 'transparent',
              border: 'none',
              color: '#aaa',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#45FFEF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
            title={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
          {isSignup && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', paddingLeft: '4px' }}>
              <div style={{ color: password.length >= 8 ? '#45FFEF' : '#aaa', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s ease' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: password.length >= 8 ? 1 : 0.3 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                At least 8 characters
              </div>
              <div style={{ color: /\d/.test(password) ? '#45FFEF' : '#aaa', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s ease' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: /\d/.test(password) ? 1 : 0.3 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                Contains a number
              </div>
              <div style={{ color: /[!@#$%^&*(),.?":{}|<>\-_]/.test(password) ? '#45FFEF' : '#aaa', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s ease' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: /[!@#$%^&*(),.?":{}|<>\-_]/.test(password) ? 1 : 0.3 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                Contains a special character
              </div>
            </div>
          )}
        </div>
      )}

      {isLogin && (
        <div style={{ textAlign: 'right', marginBottom: '15px', marginTop: '-5px' }}>
          <span
            onClick={() => setCurrentMode('forgot_password')}
            style={{ color: '#857AFF', cursor: 'pointer', fontSize: '12px', transition: 'color 0.2s ease', fontWeight: 'bold' }}
            onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
            onMouseLeave={(e) => e.target.style.color = '#857AFF'}
          >
            Forgot Password?
          </span>
        </div>
      )}

      {isSignup && (
        <div style={{ marginBottom: '15px', position: 'relative' }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: isMobile ? '10px 60px 10px 10px' : '12px 60px 12px 12px',
              border: '1px solid #857AFF',
              borderRadius: '8px',
              backgroundColor: '#111',
              color: 'white',
              fontSize: isMobile ? '16px' : '14px',
              boxSizing: 'border-box'
            }}
          />
          {confirmPassword.length > 0 && password === confirmPassword && (
            <div style={{
              position: 'absolute',
              right: '35px',
              top: isMobile ? '12px' : '14px',
              color: '#45FFEF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'modalContentFadeIn 0.2s ease-out'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: isMobile ? '9px' : '11px',
              background: 'transparent',
              border: 'none',
              color: '#aaa',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#45FFEF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
            title={showConfirmPassword ? "Hide Password" : "Show Password"}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>
      )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: isMobile ? '10px' : '12px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid #45FFFF',
              borderRadius: '25px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#45FFFF';
                e.target.style.color = 'black';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
            ) : (
              isLogin ? 'Login' : isSignup ? 'Sign Up' : 'Send Reset Link'
            )}
          </button>
        </form>

        {isForgot ? (
          <p style={{ textAlign: 'center', color: '#ccc', marginTop: '20px', fontSize: '14px' }}>
            Remember your password?{' '}
            <span 
              onClick={() => setCurrentMode('login')}
              style={{ color: '#857AFF', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
              onMouseLeave={(e) => e.target.style.color = '#857AFF'}
            >
              Back to Login
            </span>
          </p>
        ) : (
          <p style={{ textAlign: 'center', color: '#ccc', marginTop: '20px', fontSize: '14px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setCurrentMode(isLogin ? 'signup' : 'login')}
              style={{ color: '#857AFF', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
              onMouseLeave={(e) => e.target.style.color = '#857AFF'}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        )}
      </div>
      <VerificationModal 
        isOpen={showVerification} 
        onClose={() => setShowVerification(false)} 
        email={signupEmail} 
        onVerify={handleVerification}
        showToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderLeft: '4px solid #857AFF',
          borderRadius: '8px',
          padding: '15px 20px',
          color: 'white',
          boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: isToastClosing ? 'toastSlideOut 0.3s ease-in forwards' : 'toastSlideIn 0.3s ease-out forwards'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#857AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span style={{ fontSize: '14px', fontWeight: 'bold', flex: 1, marginRight: '10px' }}>{toastMessage}</span>
          <button 
            onClick={closeToast}
            style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
