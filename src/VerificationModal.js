import React, { useState, useEffect } from 'react';

const VerificationModal = ({ isOpen, onClose, email, onVerify, showToast }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationCode.trim().length === 0) {
      if (showToast) {
        showToast('Please enter a verification code');
      } else {
        alert('Please enter a verification code');
      }
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onVerify(verificationCode);
    }, 1000); // Simulate network request delay
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

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
      zIndex: 1001,
      animation: isClosing ? 'backdropFadeOut 0.3s ease forwards' : 'backdropFadeIn 0.3s ease forwards'
    }}>
      <style>
        {`
          @keyframes backdropFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes backdropFadeOut { from { opacity: 1; } to { opacity: 0; } }
          @keyframes modalContentFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          @keyframes modalContentFadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
          @keyframes spin { 100% { transform: rotate(360deg); } }
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

        <h2 style={{ textAlign: 'center', color: '#FF006B', marginTop: 0, marginBottom: isMobile ? '15px' : '10px', fontSize: isMobile ? '1.8em' : '2em' }}>
          Verify Your Email
        </h2>

        <p style={{ textAlign: 'center', color: '#45FFEF', marginBottom: isMobile ? '20px' : '30px', fontSize: '14px' }}>
          A verification code has been sent to<br /><strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              style={{
                width: '100%',
                padding: isMobile ? '10px' : '12px',
                border: '1px solid #857AFF',
                borderRadius: '8px',
                backgroundColor: '#111',
                color: 'white',
                fontSize: '18px',
                boxSizing: 'border-box',
                textAlign: 'center',
                letterSpacing: '6px',
                fontWeight: 'bold'
              }}
            />
          </div>

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
              'Verify & Complete Signup'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#ccc', marginTop: '20px', fontSize: '12px' }}>
          Didn't receive the code?{' '}
          <span 
            onClick={() => console.log('Resend verification code')}
            style={{ color: '#857AFF', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerificationModal;
