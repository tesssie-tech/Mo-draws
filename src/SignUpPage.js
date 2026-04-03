import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
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
    </div>
  );
};

export default SignUpPage;