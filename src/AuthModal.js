import React, { useState } from 'react';
import VerificationModal from './VerificationModal';

const AuthModal = ({ isOpen, onClose, mode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (mode === 'signup') {
      // Show verification modal for signup
      setSignupEmail(email);
      setShowVerification(true);
      console.log('Signup initiated:', { name, email, password });
    } else {
      // Login
      console.log('Login:', email, password);
      onClose();
    }
  };

  const handleVerification = (code) => {
    console.log('Verification code submitted:', code);
    alert('Account verified successfully! Welcome to Mo-Draws!');
    resetForm();
    setShowVerification(false);
    onClose();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSignupEmail('');
  };

  if (!isOpen) return null;

  const isLogin = mode === 'login';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '2px solid #857AFF',
        borderRadius: '15px',
        padding: '40px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(133, 122, 255, 0.3)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FF006B',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h2 style={{ textAlign: 'center', color: '#FF006B', marginTop: 0, marginBottom: '30px' }}>
          {isLogin ? 'Login to Mo-Draws' : 'Sign Up for Mo-Draws'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #857AFF',
                  borderRadius: '8px',
                  backgroundColor: '#111',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #857AFF',
                borderRadius: '8px',
                backgroundColor: '#111',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #857AFF',
                borderRadius: '8px',
                backgroundColor: '#111',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #857AFF',
                  borderRadius: '8px',
                  backgroundColor: '#111',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid #45FFFF',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#45FFFF';
              e.target.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'white';
            }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
      <VerificationModal 
        isOpen={showVerification} 
        onClose={() => setShowVerification(false)} 
        email={signupEmail} 
        onVerify={handleVerification} 
      />
    </div>
  );
};

export default AuthModal;
