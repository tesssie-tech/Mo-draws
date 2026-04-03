import React, { useState } from 'react';

const DashboardPage = ({ user, onLogout }) => {
  const [uploadedArtworks, setUploadedArtworks] = useState([
    {
      id: 1,
      title: 'Digital Illustration 1',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=300&q=80',
      date: 'Mar 20, 2026'
    },
    {
      id: 2,
      title: 'Character Design',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80',
      date: 'Mar 18, 2026'
    }
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('gallery');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const navItems = [
    { id: 'gallery', label: 'My Gallery', icon: '🎨' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'followers', label: 'Followers', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '250px' : '0px',
        height: '100vh',
        backgroundColor: '#111',
        borderRight: sidebarOpen ? '2px solid #857AFF' : 'none',
        padding: sidebarOpen ? '30px 20px' : '0',
        overflow: 'hidden',
        transition: 'width 0.3s ease, padding 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100
      }}>
        {sidebarOpen && (
          <>
            <h3 style={{ color: '#FF006B', marginTop: 0, marginBottom: '30px', fontSize: '1.3em' }}>Menu</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    backgroundColor: activeNav === item.id ? 'rgba(133, 122, 255, 0.2)' : 'transparent',
                    color: activeNav === item.id ? '#45FFEF' : '#ccc',
                    border: activeNav === item.id ? '1px solid #857AFF' : '1px solid transparent',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (activeNav !== item.id) {
                      e.target.style.color = '#45FFEF';
                      e.target.style.borderColor = '#857AFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeNav !== item.id) {
                      e.target.style.color = '#ccc';
                      e.target.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '250px' : '0',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px 40px',
          backgroundColor: '#111',
          borderBottom: '1px solid #857AFF'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #857AFF',
              color: '#857AFF',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#857AFF';
              e.target.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#857AFF';
            }}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? '←' : '→'}
          </button>

          <div>
            <h1 style={{ fontSize: '2.5em', margin: '0' }}>
              <span style={{ color: '#FF006B' }}>Mo</span>
              <span style={{ color: '#857AFF' }}>Draws</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <span style={{ color: '#45FFEF', fontSize: '1.1em' }}>
              Welcome, <strong>{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #FF006B',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FF006B';
                e.target.style.color = 'black';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          {/* Dashboard Title */}
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5em', marginBottom: '10px' }}>My Gallery</h2>
            <p style={{ color: '#45FFEF', fontSize: '1.1em' }}>Manage and showcase your digital illustrations</p>
          </div>

          {/* Upload Section */}
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '2px dashed #857AFF',
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#45FFEF';
            e.currentTarget.style.backgroundColor = '#222';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#857AFF';
            e.currentTarget.style.backgroundColor = '#1a1a1a';
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#857AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 15px', display: 'block' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3 style={{ color: '#FF006B', marginTop: 0 }}>Upload Your Artwork</h3>
            <p style={{ color: '#ccc', margin: '10px 0' }}>Drag and drop your image here, or click to select</p>
            <p style={{ color: '#857AFF', fontSize: '12px' }}>Supported formats: PNG, JPG, JPEG, GIF</p>
          </div>

          {/* Stats Section */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '50px'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #857AFF',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>{uploadedArtworks.length}</h3>
              <p style={{ color: '#45FFEF', margin: 0 }}>Artworks Uploaded</p>
            </div>
            <div style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #857AFF',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>1.2K</h3>
              <p style={{ color: '#45FFEF', margin: 0 }}>Total Views</p>
            </div>
            <div style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #857AFF',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>48</h3>
              <p style={{ color: '#45FFEF', margin: 0 }}>Followers</p>
            </div>
          </div>

          {/* Gallery Section */}
          <div>
            <h3 style={{ color: '#FF006B', marginBottom: '20px' }}>Recent Uploads</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {uploadedArtworks.map((artwork) => (
                <div 
                  key={artwork.id}
                  style={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #857AFF',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#45FFEF';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#857AFF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img 
                    src={artwork.thumbnail} 
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ color: '#FF006B', margin: '0 0 8px 0' }}>{artwork.title}</h4>
                    <p style={{ color: '#857AFF', margin: '0', fontSize: '12px' }}>{artwork.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '20px',
          borderTop: '1px solid #857AFF',
          color: '#ccc',
          backgroundColor: '#111',
          marginTop: 'auto'
        }}>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>© 2026 Mo-Draws. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <h3 style={{ color: '#FF006B', marginTop: 0 }}>Upload Your Artwork</h3>
          <p style={{ color: '#ccc', margin: '10px 0' }}>Drag and drop your image here, or click to select</p>
          <p style={{ color: '#857AFF', fontSize: '12px' }}>Supported formats: PNG, JPG, JPEG, GIF</p>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '50px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #857AFF',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>{uploadedArtworks.length}</h3>
            <p style={{ color: '#45FFEF', margin: 0 }}>Artworks Uploaded</p>
          </div>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #857AFF',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>1.2K</h3>
            <p style={{ color: '#45FFEF', margin: 0 }}>Total Views</p>
          </div>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #857AFF',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>48</h3>
            <p style={{ color: '#45FFEF', margin: 0 }}>Followers</p>
          </div>
        </div>

        {/* Gallery Section */}
        <div>
          <h3 style={{ color: '#FF006B', marginBottom: '20px' }}>Recent Uploads</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {uploadedArtworks.map((artwork) => (
              <div 
                key={artwork.id}
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #857AFF',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#45FFEF';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#857AFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img 
                  src={artwork.thumbnail} 
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{ padding: '15px' }}>
                  <h4 style={{ color: '#FF006B', margin: '0 0 8px 0' }}>{artwork.title}</h4>
                  <p style={{ color: '#857AFF', margin: '0', fontSize: '12px' }}>{artwork.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px',
        borderTop: '1px solid #857AFF',
        marginTop: '50px',
        color: '#ccc'
      }}>
        <p style={{ margin: '10px 0' }}>© 2026 Mo-Draws. All rights reserved.</p>
        <p style={{ margin: '10px 0', fontSize: '12px' }}>
          <span style={{ color: '#857AFF', cursor: 'pointer', marginRight: '15px' }}>Terms</span>
          <span style={{ color: '#857AFF', cursor: 'pointer', marginRight: '15px' }}>Privacy</span>
          <span style={{ color: '#857AFF', cursor: 'pointer' }}>Contact</span>
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;
