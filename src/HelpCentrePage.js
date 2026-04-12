import React, { useEffect, useState } from 'react';

const faqs = [
  {
    q: 'How do I upload artwork?',
    a: 'Open your dashboard and use the upload section. Add a title, category, and visibility before posting.'
  },
  {
    q: 'How do I edit or remove a post?',
    a: 'In My Gallery, hover over a card and use the edit or delete controls in the top-right corner.'
  },
  {
    q: 'Why can\'t I see someone\'s profile updates?',
    a: 'You may have muted or blocked them. Check Settings to manage blocked and muted users.'
  },
  {
    q: 'How can I contact support?',
    a: 'Email support@modraws.com and include screenshots or steps so we can help quickly.'
  }
];

const HelpCentrePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '16px 20px' : '20px 40px', backgroundColor: '#111', borderBottom: '1px solid #857AFF' }}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '2em', margin: 0 }}>
            <span style={{ color: '#FF006B' }}>Mo</span><span style={{ color: '#857AFF' }}>Draws</span>
          </h1>
        </a>
        <button
          onClick={() => navigateTo('/dashboard')}
          style={{ border: '1px solid #45FFEF', color: '#45FFEF', backgroundColor: 'transparent', padding: '10px 18px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Back to Dashboard
        </button>
      </header>

      <main style={{ flex: 1, maxWidth: '980px', width: '100%', margin: '0 auto', padding: isMobile ? '36px 18px' : '56px 30px' }}>
        <h2 style={{ margin: '0 0 12px 0', color: '#FF006B', fontSize: isMobile ? '2.1em' : '3em' }}>Help Centre</h2>
        <p style={{ margin: '0 0 24px 0', color: '#ccc', lineHeight: 1.7 }}>
          Find quick answers to common questions about your account, artwork, and community tools.
        </p>

        <div style={{ display: 'grid', gap: '14px' }}>
          {faqs.map((faq) => (
            <article key={faq.q} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: isMobile ? '16px' : '20px' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#45FFEF', fontSize: '1.1em' }}>{faq.q}</h3>
              <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{faq.a}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HelpCentrePage;
