import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lightModalMessage, setLightModalMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLightModalMessage('Passwords do not match');
      return;
    }
    // Handle sign up logic here
    console.log('Sign Up:', name, email, password);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      <h2>Sign Up for Mo-Draws</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ margin: '10px', padding: '10px', width: '200px', border: '1px solid #857AFF', borderRadius: '5px' }}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ margin: '10px', padding: '10px', width: '200px', border: '1px solid #857AFF', borderRadius: '5px' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ margin: '10px', padding: '10px', width: '200px', border: '1px solid #857AFF', borderRadius: '5px' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ margin: '10px', padding: '10px', width: '200px', border: '1px solid #857AFF', borderRadius: '5px' }}
          />
        </div>
        <button type="submit" style={{ margin: '10px', padding: '10px 20px', backgroundColor: 'transparent', color: 'white', border: '1px solid #45FFFF', borderRadius: '25px', cursor: 'pointer' }}>Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login" style={{ color: '#857AFF', fontWeight: 'bold' }}>Login</Link></p>
      {lightModalMessage && (
        <div
          onClick={() => setLightModalMessage('')}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#f8fafc',
              border: '1px solid #857AFF',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'left'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#111' }}>Notice</h3>
            <p style={{ margin: 0, color: '#334155' }}>{lightModalMessage}</p>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button
                onClick={() => setLightModalMessage('')}
                style={{ border: '1px solid #857AFF', backgroundColor: '#857AFF', color: '#fff', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;