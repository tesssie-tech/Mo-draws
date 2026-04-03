import React, { useState } from 'react';

const VerificationModal = ({ isOpen, onClose, email, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationCode.trim().length === 0) {
      alert('Please enter a verification code');
      return;
    }
    onVerify(verificationCode);
  };

  if (!isOpen) return null;

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
      zIndex: 1001
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

        <h2 style={{ textAlign: 'center', color: '#FF006B', marginTop: 0, marginBottom: '10px' }}>
          Verify Your Email
        </h2>

        <p style={{ textAlign: 'center', color: '#45FFEF', marginBottom: '30px', fontSize: '14px' }}>
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
                padding: '12px',
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
            Verify & Complete Signup
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
