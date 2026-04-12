import React, { useEffect, useState } from 'react';

const team = [
  { name: 'Mona Reed', role: 'Founder & Creative Director', bio: 'Leads product vision and creator-first design strategy.' },
  { name: 'Kai Morgan', role: 'Lead Engineer', bio: 'Builds scalable frontend systems and smooth creator workflows.' },
  { name: 'Ari Patel', role: 'Community Lead', bio: 'Supports artists, moderation, events, and creator success.' }
];

const OurTeamPage = () => {
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
        <h2 style={{ margin: '0 0 12px 0', color: '#FF006B', fontSize: isMobile ? '2.1em' : '3em' }}>Our Team</h2>
        <p style={{ margin: '0 0 24px 0', color: '#ccc', lineHeight: 1.7 }}>
          Meet the people building Mo-Draws for artists everywhere.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
          {team.map((member) => (
            <article key={member.name} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#1a1a1a', border: '1px solid #857AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#45FFEF', marginBottom: '12px' }}>
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3 style={{ margin: '0 0 6px 0', color: '#45FFEF', fontSize: '1.1em' }}>{member.name}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#857AFF', fontWeight: 'bold' }}>{member.role}</p>
              <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{member.bio}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OurTeamPage;
