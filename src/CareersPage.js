import React, { useEffect, useState } from 'react';

const jobs = [
  {
    title: 'Product Designer',
    type: 'Full-time',
    location: 'Remote',
    summary: 'Design intuitive workflows and visual systems for artists, curators, and collectors.'
  },
  {
    title: 'Frontend Engineer (React)',
    type: 'Full-time',
    location: 'Hybrid',
    summary: 'Build performant, delightful UI experiences across Mo-Draws web surfaces.'
  },
  {
    title: 'Community Manager',
    type: 'Contract',
    location: 'Remote',
    summary: 'Grow creator engagement, run programs, and support artist community initiatives.'
  }
];

const CareersPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 40px',
        backgroundColor: '#111',
        borderBottom: '1px solid #857AFF'
      }}>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}
          style={{ textDecoration: 'none' }}
        >
          <h1 style={{ fontSize: '2em', margin: 0 }}>
            <span style={{ color: '#FF006B' }}>Mo</span>
            <span style={{ color: '#857AFF' }}>Draws</span>
          </h1>
        </a>

        <button
          onClick={() => navigateTo('/dashboard')}
          style={{
            border: '1px solid #45FFEF',
            color: '#45FFEF',
            backgroundColor: 'transparent',
            padding: '10px 18px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#45FFEF';
            e.currentTarget.style.color = 'black';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#45FFEF';
          }}
        >
          Back to Dashboard
        </button>
      </header>

      <main style={{ flex: 1, padding: isMobile ? '40px 18px' : '60px 30px' }}>
        <section style={{ maxWidth: '980px', margin: '0 auto 50px auto', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: isMobile ? '2.2em' : '3em', color: '#FF006B' }}>Careers at Mo-Draws</h2>
          <p style={{ margin: 0, color: '#ccc', lineHeight: 1.7 }}>
            Join us to build the most inspiring platform for digital creators. We are looking for kind,
            ambitious people who love design, art, and thoughtful product experiences.
          </p>
        </section>

        <section style={{ maxWidth: '980px', margin: '0 auto', display: 'grid', gap: '18px' }}>
          {jobs.map((job) => (
            <article
              key={job.title}
              style={{
                border: '1px solid #333',
                borderRadius: '14px',
                backgroundColor: '#111',
                padding: isMobile ? '18px' : '22px',
                transition: 'border-color 0.2s ease, transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#857AFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, color: '#45FFEF', fontSize: '1.15em' }}>{job.title}</h3>
                <span style={{ color: '#aaa', fontSize: '13px' }}>{job.type} | {job.location}</span>
              </div>
              <p style={{ margin: '10px 0 16px 0', color: '#ccc', lineHeight: 1.6 }}>{job.summary}</p>
              <a
                href="mailto:careers@modraws.com?subject=Application%20for%20" 
                style={{ color: '#857AFF', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Apply now
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default CareersPage;
