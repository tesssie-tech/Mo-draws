import React, { useState, useEffect } from 'react';

const AboutUsPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: isMobile ? '15px 20px' : '20px 40px',
        backgroundColor: '#111',
        borderBottom: '1px solid #857AFF'
      }}>
        <a href="/" onClick={(e) => { 
          e.preventDefault(); 
          window.history.pushState(null, '', '/'); 
          window.dispatchEvent(new PopStateEvent('popstate')); 
        }} style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '2em', margin: 0 }}>
            <span style={{ color: '#FF006B' }}>Mo</span>
            <span style={{ color: '#857AFF' }}>Draws</span>
          </h1>
        </a>
        <a 
          href="/dashboard" 
          onClick={(e) => { 
            e.preventDefault(); 
            window.history.pushState(null, '', '/dashboard'); 
            window.dispatchEvent(new PopStateEvent('popstate')); 
          }}
          style={{ 
            color: '#45FFEF', 
            textDecoration: 'none', 
            border: '1px solid #45FFEF', 
            padding: '10px 20px', 
            borderRadius: '25px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFEF'; e.target.style.color = 'black'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#45FFEF'; }}
        >
          Go to Dashboard
        </a>
      </header>

      <main style={{ flex: 1, padding: isMobile ? '40px 15px' : '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? '2.5em' : '3.5em', marginBottom: '20px', color: '#FF006B' }}>About Mo-Draws</h2>
          <p style={{ fontSize: '1.2em', lineHeight: '1.6', color: '#ccc', marginBottom: '60px' }}>
            We are a community-driven platform built by creatives, for creatives. Mo-Draws exists to help digital artists showcase their masterpieces, discover new inspiration, and connect with a global network of talent.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '40px 30px', 
              borderRadius: '15px', 
              border: '1px solid #857AFF',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(133, 122, 255, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎨</div>
              <h3 style={{ color: '#45FFEF', fontSize: isMobile ? '1.3em' : '1.5em', marginBottom: '15px' }}>Our Mission</h3>
              <p style={{ color: '#aaa', lineHeight: '1.6', margin: 0 }}>To empower digital artists by providing an intuitive, beautiful platform to share, discover, and be inspired by incredible artwork from around the world.</p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '40px 30px', 
              borderRadius: '15px', 
              border: '1px solid #857AFF',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(133, 122, 255, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚀</div>
              <h3 style={{ color: '#45FFEF', fontSize: isMobile ? '1.3em' : '1.5em', marginBottom: '15px' }}>Our Vision</h3>
              <p style={{ color: '#aaa', lineHeight: '1.6', margin: 0 }}>We aim to become the premier destination for concept artists, animators, and designers to find their next big opportunity and build lasting connections.</p>
            </div>
          </div>
          
          <div style={{ marginTop: '80px', padding: isMobile ? '25px' : '40px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px dashed #FF006B' }}>
            <h3 style={{ color: 'white', fontSize: isMobile ? '1.5em' : '2em', marginBottom: '15px' }}>Join Our Community</h3>
            <p style={{ color: '#ccc', marginBottom: '30px' }}>Whether you are a seasoned professional or just starting your creative journey, there is a place for you here.</p>
            <a 
              href="/signup" 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', '/signup'); 
                window.dispatchEvent(new PopStateEvent('popstate')); 
              }}
              style={{ 
                display: 'inline-block',
                backgroundColor: '#FF006B', 
                color: 'white', 
                textDecoration: 'none', 
                padding: '12px 30px', 
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '1.1em',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#cc0056'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#FF006B'; }}
            >
              Get Started
            </a>
          </div>
        </div>
      </main>

      <footer style={{ padding: '30px 20px', borderTop: '1px solid #333', textAlign: 'center', backgroundColor: '#111' }}>
        <p style={{ color: '#ccc', margin: 0 }}>&copy; {new Date().getFullYear()} Mo-Draws. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUsPage;