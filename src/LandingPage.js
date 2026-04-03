import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeaderDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block', margin: '0 15px' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span style={{ cursor: 'pointer', color: isOpen ? '#45FFEF' : 'white', fontWeight: 'bold', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}>
        {title}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#111', padding: '10px', borderRadius: '5px', minWidth: '150px', zIndex: 10, border: '1px solid #857AFF' }}>
          {items.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              style={{ display: 'block', color: '#ccc', textDecoration: 'none', padding: '8px 10px', fontSize: '0.9em', textAlign: 'center', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#ccc'}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: '15px', border: '1px solid #857AFF', borderRadius: '10px', overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#FF006B', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1em' }}
      >
        <span style={{ fontWeight: 'bold' }}>{question}</span>
        <span style={{ color: '#FF006B', fontSize: '1.5em', lineHeight: '1' }}>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '15px', borderTop: '1px solid #857AFF', backgroundColor: '#111' }}>
          <p style={{ margin: 0, color: '#45FFEF' }}>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FooterLink = ({ href, children }) => (
  <a 
    href={href} 
    style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }} 
    onMouseEnter={(e) => e.target.style.color = '#45FFEF'} 
    onMouseLeave={(e) => e.target.style.color = '#ccc'}
  >
    {children}
  </a>
);

const CustomVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      style={{ flex: 1, position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '2px solid #857AFF', cursor: 'pointer' }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) {
          videoRef.current.style.transform = 'scale(1.05)';
          videoRef.current.muted = false;
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.style.transform = 'scale(1)';
          videoRef.current.muted = true;
        }
      }}
      onClick={togglePlay}
    >
      <video 
        ref={videoRef}
        src={src} 
        autoPlay loop muted playsInline 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} 
      />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: isHovered || !isPlaying ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isHovered || !isPlaying ? 1 : 0, transition: 'opacity 0.2s ease, transform 0.2s ease', color: '#45FFFF' }}>
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      {/* Header with Logo */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: 'black' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2.5em', margin: '0' }}>
            <span style={{ color: '#FF006B' }}>Mo</span>
            <span style={{ color: '#857AFF' }}>Draws</span>
          </h1>
        </div>
        <nav style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <HeaderDropdown 
              title="Shop" 
              items={[
                { label: 'Etsy Store', link: '#' },
                { label: 'Redbubble', link: '#' },
                { label: 'Gumroad', link: '#' }
              ]} 
            />
            <a 
              href="#faq" 
              style={{ color: 'white', textDecoration: 'none', margin: '0 15px', fontWeight: 'bold', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              Frequently Asked
            </a>
            <HeaderDropdown 
              title="Contact Us" 
              items={[
                { label: 'Twitter', link: '#' },
                { label: 'Instagram', link: '#' },
                { label: 'Discord', link: '#' }
              ]} 
            />
        </nav>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/login">
            <button 
              style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: 'transparent', color: 'white', border: '1px solid #45FFFF', borderRadius: '25px', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFFF'; e.target.style.color = 'black'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'; }}
            >
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button 
              style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: 'transparent', color: 'white', border: '1px solid #45FFFF', borderRadius: '25px', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFFF'; e.target.style.color = 'black'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'; }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ textAlign: 'left', padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Welcome to Mo-Draws</h1>
        <p>Your ultimate platform for storing and showcasing digital illustrations.</p>
        <p>Upload, organize, and share your artwork with ease.</p>
        <Link to="/signup">
          <button 
            style={{ margin: '10px 0', padding: '15px 30px', fontSize: '1.2em', border: '1px solid #45FFFF', backgroundColor: isHeroHovered ? '#45FFFF' : 'transparent', color: isHeroHovered ? 'black' : 'white', borderRadius: '25px', cursor: 'pointer', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
          >
            Get Started
            <span style={{ display: 'inline-block', transition: 'transform 0.2s ease', transform: isHeroHovered ? 'translateX(5px)' : 'translateX(0)', marginLeft: '6px' }}>
              →
            </span>
          </button>
        </Link>
      </section>

      {/* About the Creator Section */}
      <section style={{ padding: '50px', backgroundColor: 'black', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', maxWidth: '800px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px', padding: '20px', textAlign: 'center' }}>
            <img 
              src="img/Princess.png" 
              alt="The Creator" 
              style={{  width: '250px', height: '250px', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ flex: '2', minWidth: '300px', padding: '20px', textAlign: 'left' }}>
            <h2>About the Creator</h2>
            <p>
              Hello! I'm the creator of Mo-Draws. As a passionate digital artist/developer myself, I wanted to build a platform that truly understands the needs of creators. Mo-Draws was born out of the desire to have a seamless, beautiful, and organized space to store and showcase illustrations. My mission is to empower artists worldwide to share their vision and connect with others who appreciate digital art.
            </p>
          </div>
        </div>
      </section>

      {/* About Sections */}
      <section style={{ padding: '50px', backgroundColor: 'black' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
            <h2>What is Mo-Draws?</h2>
            <p>Mo-Draws is a dedicated space for digital artists to store, organize, and showcase their illustrations. Whether you're a professional artist or a hobbyist, our platform provides the tools you need to manage your portfolio and connect with an audience.</p>
          </div>
          <div style={{ flex: '1.5', minWidth: '350px', display: 'flex', flexDirection: 'row', gap: '15px' }}>
            {/* Left Column: Image Slider */}
            <div style={{ flex: '2', position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '2px solid #857AFF' }}>
              <img 
                src={sliderImages[currentSlide]} 
                alt={`Slide ${currentSlide + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.5s ease-in-out' }} 
              />
              <div style={{ position: 'absolute', bottom: '15px', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {sliderImages.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentSlide(index)}
                    style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: currentSlide === index ? '#FF006B' : 'rgba(255, 255, 255, 0.5)', border: 'none', cursor: 'pointer', padding: 0 }} 
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Right Column: Videos (Stacked vertically) */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <CustomVideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />
              <CustomVideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '50px', backgroundColor: 'black' }}>
        <h2>Key Features</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '300px', margin: '20px', border: '1px solid #857AFF', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#45FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3>Easy Uploads</h3>
            <p>Upload your digital art in various formats and organize them into collections.</p>
          </div>
          <div style={{ maxWidth: '300px', margin: '20px', border: '1px solid #857AFF', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF006B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <h3>Showcase Your Work</h3>
            <p>Display your artwork beautifully with customizable galleries.</p>
          </div>
          <div style={{ maxWidth: '300px', margin: '20px', border: '1px solid #857AFF', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#857AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3>Community Engagement</h3>
            <p>Share your art with the community and get feedback from fellow artists.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '50px', backgroundColor: 'black' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#45FFEF' }}>Frequently Asked Questions</h2>
          <FAQItem question="Is Mo-Draws free to use?" answer="Yes! Mo-Draws offers a free basic tier for you to upload and organize your digital illustrations. We also have premium tiers with more storage and advanced features." />
          <FAQItem question="What file formats are supported?" answer="We currently support most common image formats including JPEG, PNG, GIF, and SVG." />
          <FAQItem question="Can I keep my artwork private?" answer="Absolutely. You can set individual pieces or entire collections to private, meaning only you can see them until you're ready to share." />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '50px 20px', backgroundColor: '#0a0a0a', color: 'white', borderTop: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
          
          {/* 1. Logo */}
          <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '2.5em', margin: '0' }}>
              <span style={{ color: '#FF006B' }}>Mo</span>
              <span style={{ color: '#857AFF' }}>Draws</span>
            </h2>
          </div>

          {/* 2. Things you can do */}
          <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
            <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Built For Creatives</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="#">Upload Art</FooterLink>
              <FooterLink href="#">Build Portfolio</FooterLink>
              <FooterLink href="#">Join Community</FooterLink>
            </div>
          </div>

          {/* 3. Talents */}
          <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
            <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Find Talent</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="#">Illustrators</FooterLink>
              <FooterLink href="#">Concept Artists</FooterLink>
              <FooterLink href="#">Animators</FooterLink>
              <FooterLink href="#">Video Editors</FooterLink>
              <FooterLink href="#">Graphic Designers</FooterLink>
            </div>
          </div>

          {/* 4. About */}
          <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
            <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Mo-Draws</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Guidelines</FooterLink>
              <FooterLink href="#">Help centre</FooterLink>
              <FooterLink href="#">Our Team</FooterLink>
            </div>
          </div>
        
          {/* 5. Social Media */}
          <div style={{ flex: '1', minWidth: '150px', marginBottom: '20px' }}>
            <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#45FFFF', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#45FFFF'}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 50.85V0h88a148.62 148.62 0 0 0 148.62 148.62z"></path></svg>
              </a>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#45FFFF', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#45FFFF'}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
              </a>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#45FFFF', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#45FFFF'}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M13.46 6c.73-.12 1.45-.88 1.66-1.6.15-1.08-1.09-2-2.12-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.03 0 2.27-.92 2.12-2-.21-.72-.93-1.48-1.66-1.6-.27-.04-.54-.04-.81-.04H8V6h5.46zM9 9h4v2H9V9zm4 4H9v2h4v-2z"></path></svg>
              </a>
            </div>
          </div>

        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #222' }}>
          <p style={{ fontSize: '0.8em', margin: 0, color: '#ccc' }}>&copy; 2026 Mo-Draws. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;