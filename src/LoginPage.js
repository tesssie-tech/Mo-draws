import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', email, password);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      <h2>Login to Mo-Draws</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" style={{ margin: '10px', padding: '10px 20px', backgroundColor: 'transparent', color: 'white', border: '1px solid #45FFFF', borderRadius: '25px', cursor: 'pointer' }}>Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup" style={{ color: '#857AFF', fontWeight: 'bold' }}>Sign Up</Link></p>
    </div>
  );
};

export default LoginPage;