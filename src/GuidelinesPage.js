import React, { useEffect, useState } from 'react';

const rules = [
  {
    title: 'Respect Original Work',
    text: 'Upload only work you created or have permission to publish. Always credit collaborators clearly.'
  },
  {
    title: 'Keep It Professional',
    text: 'Use constructive language in comments and messages. Harassment and hate speech are not allowed.'
  },
  {
    title: 'Tag Content Clearly',
    text: 'Choose the right category and visibility so other creators can discover your work easily.'
  },
  {
    title: 'Quality Over Spam',
    text: 'Share meaningful updates. Repeated low-effort or duplicate uploads may be removed.'
  }
];

const GuidelinesPage = () => {
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
        <h2 style={{ margin: '0 0 12px 0', color: '#FF006B', fontSize: isMobile ? '2.1em' : '3em' }}>Community Guidelines</h2>
        <p style={{ margin: '0 0 24px 0', color: '#ccc', lineHeight: 1.7 }}>
          These guidelines keep Mo-Draws welcoming, fair, and inspiring for every creator.
        </p>

        <div style={{ display: 'grid', gap: '14px' }}>
          {rules.map((rule) => (
            <article key={rule.title} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: isMobile ? '16px' : '20px' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#45FFEF', fontSize: '1.1em' }}>{rule.title}</h3>
              <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{rule.text}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuidelinesPage;
