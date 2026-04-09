import React, { useState, useEffect, useRef } from 'react';

const FooterLink = ({ href, children }) => {
  const handleClick = (e) => {
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If the anchor is not on the dashboard page, navigate to the landing page
        window.location.href = '/' + href;
      }
    } else if (href.startsWith('/')) {
      // Prevent full page reload and trigger SPA routing for local pages
      e.preventDefault();
      window.history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }} 
      onMouseEnter={(e) => e.target.style.color = '#45FFEF'} 
      onMouseLeave={(e) => e.target.style.color = '#ccc'}
    >
      {children}
    </a>
  );
};

const CustomSelect = ({ value, onChange, options, style, triggerStyle, menuAlign = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div 
      style={{ position: 'relative', ...style }}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.2s ease',
          ...triggerStyle,
          borderColor: isOpen || isHovered ? '#45FFEF' : (triggerStyle?.borderColor || 'transparent')
        }}
      >
        <span style={{ 
          color: isOpen || isHovered ? (triggerStyle?.hoverColor || '#45FFEF') : (triggerStyle?.color || 'white'),
          transition: 'color 0.2s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {selectedOption ? selectedOption.label : value}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ 
          marginLeft: '8px', 
          transition: 'transform 0.2s ease, color 0.2s ease', 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          color: isOpen || isHovered ? (triggerStyle?.hoverColor || '#45FFEF') : (triggerStyle?.color || 'white'),
          flexShrink: 0
        }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: menuAlign === 'left' ? 0 : 'auto',
          right: menuAlign === 'right' ? 0 : 'auto',
          width: triggerStyle?.width || '100%',
          minWidth: 'max-content',
          backgroundColor: '#1a1a1a',
          border: '1px solid #857AFF',
          borderRadius: '8px',
          zIndex: 1000,
          overflow: 'hidden',
          boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
          animation: 'tabFadeIn 0.2s ease-out forwards'
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '10px 15px',
                color: value === opt.value ? '#45FFEF' : 'white',
                backgroundColor: value === opt.value ? 'rgba(133, 122, 255, 0.15)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: triggerStyle?.fontSize || '14px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2a2a2a';
                if (value !== opt.value) e.target.style.color = '#FF006B';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = value === opt.value ? 'rgba(133, 122, 255, 0.15)' : 'transparent';
                if (value !== opt.value) e.target.style.color = 'white';
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function useLocalStorage(key, initialValue, isJson = true) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return isJson ? JSON.parse(saved) : saved;
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, isJson ? JSON.stringify(value) : value);
  }, [key, value, isJson]);

  return [value, setValue];
}

const MasonryGrid = ({ isMobile, gridSize, style, children }) => (
  <div style={{
    columnWidth: isMobile ? '150px' : gridSize === 'small' ? '150px' : gridSize === 'large' ? '300px' : '220px',
    columnGap: '20px',
    ...style
  }}>
    {children}
  </div>
);

const ArtworkCard = ({ 
  artwork, 
  onClick, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  isFavorite, 
  type = 'gallery' 
}) => {
  const hoverBorderColor = type === 'gallery' ? '#45FFEF' : '#FF006B';
  const hoverBoxShadow = type === 'gallery' 
    ? '0 10px 20px rgba(69, 255, 239, 0.1)' 
    : '0 10px 20px rgba(255, 0, 107, 0.15)';

  return (
    <div 
      onClick={() => onClick(artwork)}
      style={{
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        marginBottom: '20px',
        display: 'inline-block',
        width: '100%',
        backgroundColor: '#1a1a1a',
        border: '1px solid #857AFF',
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverBorderColor;
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = hoverBoxShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#857AFF';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {type === 'gallery' && (
        <>
          <button
            onClick={(e) => onEdit(artwork.id, artwork.title, e)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '45px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#45FFEF',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45FFEF';
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)';
              e.currentTarget.style.color = '#45FFEF';
            }}
            title="Edit Title"
          >
            ✎
          </button>
          <button
            onClick={(e) => onDelete(artwork.id, e)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#FF006B',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF006B';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)';
              e.currentTarget.style.color = '#FF006B';
            }}
            title="Delete Artwork"
          >
            ×
          </button>
        </>
      )}

      {type === 'foryou' && (
        <button
          onClick={(e) => onToggleFavorite(artwork, e)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "#FF006B" : "none"} stroke="#FF006B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      )}

      <img 
        src={artwork.thumbnail} 
        alt={artwork.title}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      <div style={{ padding: '15px' }}>
        <h4 style={{ color: '#FF006B', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artwork.title}</h4>
        <p style={{ color: '#857AFF', margin: '0', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {type === 'gallery' ? artwork.date : `by ${artwork.author}`}
        </p>
      </div>
    </div>
  );
};

const DashboardPage = ({ user, onLogout, onUpdateUser }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [artworkTitle, setArtworkTitle] = useState('');
  const [artworkCategory, setArtworkCategory] = useState('Illustrations');
  const [uploadedArtworks, setUploadedArtworks] = useLocalStorage('uploadedArtworks', [
    {
      id: 1,
      title: 'Digital Illustration 1',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=300&q=80',
      date: 'Mar 20, 2026',
      category: 'Illustrations'
    },
    {
      id: 2,
      title: 'Character Design',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80',
      date: 'Mar 18, 2026',
      category: 'Concept Arts'
    }
  ]);
  
  const [favoriteArtworks, setFavoriteArtworks] = useLocalStorage('favoriteArtworks', [
    {
      id: 101,
      title: 'Neon Nights',
      author: 'CyberArtist99',
      thumbnail: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 102,
      title: 'Abstract Dimensions',
      author: 'PolyRenderer',
      thumbnail: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 103,
      title: 'Synthwave Portrait',
      author: 'RetroDreamer',
      thumbnail: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const [followersList, setFollowersList] = useLocalStorage('followersList', [
    { id: 201, name: 'Alex River', handle: '@ariver_art', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', isFollowing: false },
    { id: 202, name: 'Sam Chen', handle: '@samc_draws', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', isFollowing: true },
    { id: 203, name: 'Jordan Lee', handle: '@jordan_concepts', avatar: 'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?auto=format&fit=crop&w=100&q=80', isFollowing: false }
  ]);

  const [recommendedArtworks, setRecommendedArtworks] = useLocalStorage('recommendedArtworks', [
    {
      id: 301,
      title: 'Cyber City',
      author: 'NeonDreamer',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 302,
      title: 'Holographic Dreams',
      author: 'VaporWave',
      thumbnail: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 303,
      title: 'Space Station Alpha',
      author: 'StarGazer',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 304,
      title: 'Glitch Art #4',
      author: 'PixelMage',
      thumbnail: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791d?auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeNav, setActiveNav] = useLocalStorage('activeNav', () => {
    const path = window.location.pathname.substring(1);
    const validPaths = ['dashboard', 'for-you', 'gallery', 'profile', 'favorites', 'followers', 'settings'];
    if (validPaths.includes(path)) return path;
    return 'dashboard';
  }, false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useLocalStorage('notifications', [
    { id: 1, text: 'Alex River started following you.', time: '2 hours ago', read: false },
    { id: 2, text: 'Sam Chen liked your artwork "Cyber City".', time: '5 hours ago', read: false },
    { id: 3, text: 'System: Welcome to Mo-Draws!', time: '1 day ago', read: true }
  ]);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [isFiltering, setIsFiltering] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isToastClosing, setIsToastClosing] = useState(false);
  const toastTimeoutRef = useRef(null);
  const toastCloseTimeoutRef = useRef(null);

  const closeToast = () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (toastCloseTimeoutRef.current) clearTimeout(toastCloseTimeoutRef.current);
    setIsToastClosing(true);
    toastCloseTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setIsToastClosing(false);
    }, 300);
  };

  const showToast = (message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (toastCloseTimeoutRef.current) clearTimeout(toastCloseTimeoutRef.current);
    
    setToastMessage(message);
    setIsToastClosing(false);
    
    toastTimeoutRef.current = setTimeout(closeToast, 3000); // Show toast for 3 seconds
  };
  
  const ARTWORKS_PER_PAGE = 9; // Number of artworks to display per load
  const [displayCountGallery, setDisplayCountGallery] = useState(ARTWORKS_PER_PAGE);
  const [displayCountForYou, setDisplayCountForYou] = useState(ARTWORKS_PER_PAGE);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Artist',
    email: user?.email || 'artist@mo-draws.com',
    bio: localStorage.getItem('userBio') || 'Digital artist exploring neon colors and cyberpunk themes. Available for freelance work.',
    portfolio: localStorage.getItem('userPortfolio') || 'https://my-awesome-art.com'
  });
  const [avatar, setAvatar] = useLocalStorage('userAvatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', false);
  // State for favorites pagination
  const [displayCountFavorites, setDisplayCountFavorites] = useState(ARTWORKS_PER_PAGE);
  const [sortOrder, setSortOrder] = useLocalStorage('sortOrder', 'newest', false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      const validPaths = ['dashboard', 'for-you', 'gallery', 'profile', 'favorites', 'followers', 'settings'];
      if (validPaths.includes(path)) {
        setActiveNav(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load settings from localStorage or use defaults
  const [emailNotifications, setEmailNotifications] = useLocalStorage('emailNotifications', true);
  const [publicProfile, setPublicProfile] = useLocalStorage('publicProfile', false);
  const [appTheme, setAppTheme] = useLocalStorage('appTheme', 'dark', false);
  const [accentColor, setAccentColor] = useLocalStorage('accentColor', '#857AFF', false);
  const [gridSize, setGridSize] = useLocalStorage('gridSize', 'medium', false);

  useEffect(() => {
    if (window.location.pathname !== `/${activeNav}`) {
      window.history.pushState(null, '', `/${activeNav}`);
    }
  }, [activeNav]);

  useEffect(() => {
    // Reset display counts when navigating to a new content section
    setDisplayCountGallery(ARTWORKS_PER_PAGE);
    setDisplayCountForYou(ARTWORKS_PER_PAGE);
    setDisplayCountFavorites(ARTWORKS_PER_PAGE);
    setActiveCategoryFilter('All');
  }, [activeNav]);

  useEffect(() => {
    if (selectedArtwork) {
      setImageLoading(true);
    }
  }, [selectedArtwork]);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 400); // 400ms loading effect
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategoryFilter, sortOrder, activeNav]);

  // Derived state for search filtering
  const sortItems = (items) => {
    const sorted = [...items];
    switch (sortOrder) {
      case 'oldest':
        return sorted.reverse(); // Reverses the default newest-first order
      case 'a-z':
        return sorted.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
      case 'z-a':
        return sorted.sort((a, b) => (b.title || b.name).localeCompare(a.title || a.name));
      case 'newest':
      default:
        return sorted;
    }
  };

  const filteredUploadedArtworks = sortItems(uploadedArtworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.date.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const filteredFavoriteArtworks = sortItems(favoriteArtworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.author.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const filteredFollowersList = sortItems(followersList.filter(follower => 
    follower.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    follower.handle.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const filteredRecommendedArtworks = sortItems(recommendedArtworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.author.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const handleDeleteArtwork = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      setUploadedArtworks(prev => prev.filter(art => art.id !== id));
      setRecommendedArtworks(prev => prev.filter(art => art.id !== id));
    }
  };

  const handleEditArtworkTitle = (id, currentTitle, e) => {
    e.stopPropagation();
    const newTitle = window.prompt('Enter new title:', currentTitle);
    if (newTitle !== null && newTitle.trim() !== '') {
      setUploadedArtworks(prev => prev.map(art => 
        art.id === id ? { ...art, title: newTitle.trim() } : art
      ));
      setRecommendedArtworks(prev => prev.map(art => 
        art.id === id ? { ...art, title: newTitle.trim() } : art
      ));
      if (selectedArtwork && selectedArtwork.id === id) {
        setSelectedArtwork(prev => ({ ...prev, title: newTitle.trim() }));
      }
    }
  };

  const toggleFavorite = (artwork, e) => {
    e.stopPropagation(); // Prevents the lightbox modal from opening when clicking the heart
    if (favoriteArtworks.some(art => art.id === artwork.id)) {
      setFavoriteArtworks(prev => prev.filter(art => art.id !== artwork.id));
    } else {
      setFavoriteArtworks(prev => [artwork, ...prev]);
    }
  };

  const handleToggleFollow = (id) => {
    setFollowersList(prev => prev.map(follower => 
      follower.id === id ? { ...follower, isFollowing: !follower.isFollowing } : follower
    ));
  };

  // Derived state for the slideshow modal
  const currentGallery = activeNav === 'favorites' ? filteredFavoriteArtworks : 
                         activeNav === 'for-you' ? filteredRecommendedArtworks : 
                         filteredUploadedArtworks;
  const selectedIndex = selectedArtwork ? currentGallery.findIndex(art => art.id === selectedArtwork.id) : -1;

  const goToNextArtwork = (e) => {
    e.stopPropagation();
    if (selectedIndex >= 0) {
      setSelectedArtwork(currentGallery[(selectedIndex + 1) % currentGallery.length]);
    }
  };

  const goToPrevArtwork = (e) => {
    e.stopPropagation();
    if (selectedIndex >= 0) {
      setSelectedArtwork(currentGallery[(selectedIndex - 1 + currentGallery.length) % currentGallery.length]);
    }
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      setSelectedArtwork(null);
      setIsClosing(false);
    }, 300);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      // Simulate account deletion by clearing user data from local storage
      localStorage.removeItem('uploadedArtworks');
      localStorage.removeItem('favoriteArtworks');
      localStorage.removeItem('notifications');
      localStorage.removeItem('followersList');
      localStorage.removeItem('userBio');
      localStorage.removeItem('userPortfolio');
      localStorage.removeItem('userAvatar');
      onLogout();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { id: 'for-you', label: 'For You', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
    { id: 'gallery', label: 'My Gallery', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> },
    { id: 'profile', label: 'Profile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    { id: 'favorites', label: 'Favorites', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> },
    { id: 'followers', label: 'Followers', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { id: 'settings', label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> }
  ];

  const filterTransitionStyles = {
    pointerEvents: isFiltering ? 'none' : 'auto',
    opacity: isFiltering ? 0.5 : 1,
    transition: 'opacity 0.2s ease',
    animation: isFiltering ? 'skeletonPulse 0.8s infinite alternate ease-in-out' : 'none'
  };

  const categoriesToRender = activeCategoryFilter === 'All' 
    ? ['Illustrations', 'Concept Arts', 'Animations', 'Video Edits', 'Graphic Designs'] 
    : [activeCategoryFilter];

  const renderCategoryFilters = () => (
    <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
      {['All', 'Illustrations', 'Concept Arts', 'Animations', 'Video Edits', 'Graphic Designs'].map(category => (
        <button
          key={category}
          onClick={() => {
            setActiveCategoryFilter(category);
            setDisplayCountGallery(ARTWORKS_PER_PAGE);
            setDisplayCountForYou(ARTWORKS_PER_PAGE);
            setDisplayCountFavorites(ARTWORKS_PER_PAGE);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeCategoryFilter === category ? `1px solid ${accentColor}` : '1px solid #333',
            backgroundColor: activeCategoryFilter === category ? `${accentColor}33` : '#1a1a1a',
            color: activeCategoryFilter === category ? '#fff' : '#ccc',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (activeCategoryFilter !== category) {
              e.target.style.borderColor = accentColor;
              e.target.style.color = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategoryFilter !== category) {
              e.target.style.borderColor = '#333';
              e.target.style.color = '#ccc';
            }
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <style>
        {`
          @keyframes tabFadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .tab-content-animated {
            animation: tabFadeIn 0.3s ease-out forwards;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes backdropFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes modalContentFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes modalContentFadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
          @keyframes skeletonPulse {
            0% { opacity: 0.7; filter: blur(1px); }
            50% { opacity: 0.3; filter: blur(3px); }
            100% { opacity: 0.7; filter: blur(1px); }
          }
          @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes toastSlideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(50px); }
          }
          
          /* Hide scrollbar for a cleaner UI */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}
      </style>
      {/* Mobile Overlay */}
      <div 
        onClick={() => setSidebarOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 99,
          opacity: isMobile && sidebarOpen ? 1 : 0,
          pointerEvents: isMobile && sidebarOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Sidebar */}
      <aside style={{
        width: isMobile ? '250px' : (sidebarOpen ? '250px' : '0px'),
        height: '100vh',
        backgroundColor: '#111',
        borderRight: (isMobile || sidebarOpen) ? '2px solid #857AFF' : 'none',
        padding: isMobile ? '30px 20px' : (sidebarOpen ? '30px 20px' : '0'),
        overflow: 'hidden',
        transition: 'transform 0.3s ease, width 0.3s ease, padding 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'
      }}>
        <div style={{
          width: '210px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          opacity: isMobile ? 1 : (sidebarOpen ? 1 : 0),
          transition: 'opacity 0.2s ease',
          pointerEvents: (isMobile || sidebarOpen) ? 'auto' : 'none'
        }}>
            {/* Logo Section */}
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '1.8em', margin: '0 0 10px 0' }}>
                <span style={{ color: '#FF006B' }}>Mo</span>
                <span style={{ color: '#857AFF' }}>Draws</span>
              </h1>
             
            </div>

            {/* Menu Items */}
            <h3 style={{ color: '#FF006B', marginTop: 0, marginBottom: '20px', fontSize: '1.1em' }}>Menu</h3>
            <nav className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '8px' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
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
                  <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 15px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #FF006B',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '100%',
                marginTop: '20px'
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
      </aside>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: (!isMobile && sidebarOpen) ? '250px' : '0',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: isMobile ? '15px 20px' : '15px 40px',
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

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '20px', flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: 'flex-end' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#857AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #857AFF',
                  borderRadius: '20px',
                  padding: '10px 15px 10px 35px',
                  color: 'white',
                  outline: 'none',
                  width: isMobile ? '110px' : '250px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s, box-shadow 0.2s, width 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#45FFEF';
                  e.target.style.boxShadow = '0 0 8px rgba(69, 255, 239, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#857AFF';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Sort Dropdown */}
            <CustomSelect
              value={sortOrder}
              onChange={setSortOrder}
              menuAlign="right"
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'a-z', label: 'A-Z' },
                { value: 'z-a', label: 'Z-A' }
              ]}
              triggerStyle={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#857AFF',
                hoverColor: '#45FFEF',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '8px 0',
              }}
            />

            {/* Grid Layout Toggle */}
            <button
              onClick={() => setGridSize(prev => prev === 'small' ? 'medium' : prev === 'medium' ? 'large' : 'small')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#857AFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#45FFEF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#857AFF'}
              title={`Grid size: ${gridSize} (click to toggle)`}
            >
              {gridSize === 'small' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="4" height="4"></rect><rect x="10" y="3" width="4" height="4"></rect><rect x="17" y="3" width="4" height="4"></rect><rect x="3" y="10" width="4" height="4"></rect><rect x="10" y="10" width="4" height="4"></rect><rect x="17" y="10" width="4" height="4"></rect><rect x="3" y="17" width="4" height="4"></rect><rect x="10" y="17" width="4" height="4"></rect><rect x="17" y="17" width="4" height="4"></rect></svg>
              ) : gridSize === 'large' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              )}
            </button>

            {/* Notification Button */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#857AFF',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#45FFEF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#857AFF'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadNotificationsCount > 0 && (
                  <span style={{ position: 'absolute', top: '6px', right: '8px', backgroundColor: '#FF006B', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #111' }}></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '-10px',
                  marginTop: '10px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #857AFF',
                  borderRadius: '10px',
                  width: '300px',
                  zIndex: 200,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: '#FF006B' }}>Notifications</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {unreadNotificationsCount > 0 && (
                        <button 
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                          style={{ background: 'transparent', border: 'none', color: '#45FFEF', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                          Mark all read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button 
                          onClick={() => setNotifications([])}
                          style={{ background: 'transparent', border: 'none', color: '#FF006B', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="hide-scrollbar" style={{ overflowY: 'auto', maxHeight: '350px' }}>
                    {notifications.length === 0 ? (
                      <p style={{ padding: '20px', color: '#ccc', textAlign: 'center', margin: 0, fontSize: '14px' }}>No notifications yet.</p>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          style={{ 
                            padding: '15px', 
                            borderBottom: '1px solid #333', 
                            backgroundColor: notification.read ? 'transparent' : 'rgba(133, 122, 255, 0.1)',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                          onClick={() => setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n))}
                          onMouseEnter={(e) => { if (notification.read) e.currentTarget.style.backgroundColor = '#222'; }}
                          onMouseLeave={(e) => { if (notification.read) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                            <p style={{ margin: 0, color: notification.read ? '#ccc' : 'white', fontSize: '14px' }}>{notification.text}</p>
                            <span style={{ color: '#857AFF', fontSize: '12px' }}>{notification.time}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotifications(notifications.filter(n => n.id !== notification.id));
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#857AFF',
                              cursor: 'pointer',
                              padding: '2px',
                              fontSize: '18px',
                              lineHeight: '1',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#FF006B'}
                            onMouseLeave={(e) => e.target.style.color = '#857AFF'}
                            title="Delete notification"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Image with Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #45FFEF', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} 
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              
              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #857AFF',
                  borderRadius: '10px',
                  padding: '10px 0',
                  minWidth: '150px',
                  zIndex: 200,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
                }}>
                  <button 
                    onClick={() => { setActiveNav('profile'); setProfileDropdownOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 20px', backgroundColor: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.target.style.color = '#45FFEF'; e.target.style.backgroundColor = '#222'; }}
                    onMouseLeave={(e) => { e.target.style.color = '#ccc'; e.target.style.backgroundColor = 'transparent'; }}
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => { setActiveNav('settings'); setProfileDropdownOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 20px', backgroundColor: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.target.style.color = '#45FFEF'; e.target.style.backgroundColor = '#222'; }}
                    onMouseLeave={(e) => { e.target.style.color = '#ccc'; e.target.style.backgroundColor = 'transparent'; }}
                  >
                    Settings
                  </button>
                  <div style={{ height: '1px', backgroundColor: '#333', margin: '5px 0' }}></div>
                  <button 
                    onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 20px', backgroundColor: 'transparent', border: 'none', color: '#FF006B', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#222'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Layout Wrapper */}
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          {/* Page Content */}
          <div key={activeNav} className="tab-content-animated" style={{ flex: 1, padding: isMobile ? '20px' : '40px' }}>
            {activeNav === 'dashboard' && (
            <>
          {/* Dashboard Title */}
          <div style={{ marginBottom: '50px', textAlign: 'left' }}>
            <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>Welcome, {user?.name || 'Artist'}!</h2>
          </div>

          {/* Top Row: Upload and Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '50px' }}>
            
            {/* Upload Section */}
            <div style={{
              flex: '1',
              minWidth: isMobile ? '100%' : '300px',
              backgroundColor: '#1a1a1a',
              border: '2px dashed #857AFF',
              borderRadius: '15px',
              padding: isMobile ? '20px' : '40px',
              textAlign: 'center',
              cursor: previewImage ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onClick={() => {
              if (!previewImage) {
                document.getElementById('artwork-upload').click();
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#45FFEF';
              e.currentTarget.style.backgroundColor = '#222';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#857AFF';
              e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}>
              <input 
                id="artwork-upload"
                type="file" 
                accept="image/png, image/jpeg, image/gif" 
                style={{ display: 'none' }} 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImage(reader.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              
              {previewImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '10px', marginBottom: '20px' }} />
                  
                  <input 
                    type="text" 
                    placeholder="Enter artwork title..." 
                    value={artworkTitle}
                    onChange={(e) => setArtworkTitle(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '250px',
                      padding: '10px 15px',
                      marginBottom: '20px',
                      backgroundColor: '#111',
                      border: '1px solid #857AFF',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#45FFEF'}
                    onBlur={(e) => e.target.style.borderColor = '#857AFF'}
                  />

                  <CustomSelect
                    value={artworkCategory}
                    onChange={setArtworkCategory}
                    style={{ width: '100%', maxWidth: '250px', marginBottom: '20px' }}
                    options={[
                      { value: 'Illustrations', label: 'Illustrations' },
                      { value: 'Concept Arts', label: 'Concept Arts' },
                      { value: 'Animations', label: 'Animations' },
                      { value: 'Video Edits', label: 'Video Edits' },
                      { value: 'Graphic Designs', label: 'Graphic Designs' }
                    ]}
                    triggerStyle={{
                      padding: '10px 15px',
                      backgroundColor: '#111',
                      border: '1px solid #857AFF',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setPreviewImage(null); 
                        setArtworkTitle('');
                setArtworkCategory('Illustrations');
                        document.getElementById('artwork-upload').value = ''; 
                      }} 
                      style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #FF006B', color: '#FF006B', borderRadius: '25px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); // Prevent default form submission if any
                        const newArtwork = {
                          id: uploadedArtworks.length + 1 + Math.random(), // Simple unique ID
                          title: artworkTitle.trim() || `Artwork ${uploadedArtworks.length + 1}`,
                          thumbnail: previewImage,
                          date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  category: artworkCategory
                        };
                        setUploadedArtworks((prevArtworks) => [
                          newArtwork,
                          ...prevArtworks, // Add new artwork at the beginning
                        ]);
                        setRecommendedArtworks((prev) => [
                  { ...newArtwork, author: user?.name || 'Artist', category: artworkCategory },
                          ...prev // Add new artwork to the For You page with the author's name
                        ]);
                        showToast('Artwork uploaded successfully!');
                        setPreviewImage(null); 
                        setArtworkTitle('');
                setArtworkCategory('Illustrations');
                        document.getElementById('artwork-upload').value = ''; 
                      }} 
                      style={{ padding: '10px 20px', backgroundColor: '#45FFEF', border: 'none', color: 'black', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                    >
                      Upload Artwork
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#857AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 15px', display: 'block' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <h3 style={{ color: '#FF006B', marginTop: 0 }}>Upload Your Artwork</h3>
                  <p style={{ color: '#ccc', margin: '10px 0' }}>Drag and drop your image here, or click to select</p>
                  <p style={{ color: '#857AFF', fontSize: '12px' }}>Supported formats: PNG, JPG, JPEG, GIF</p>
                </>
              )}
            </div>

            {/* Stats Section */}
            <div style={{ 
              flex: '1',
              minWidth: isMobile ? '100%' : '300px',
              display: 'flex', 
              flexDirection: 'column',
              gap: '20px'
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
          </div>

          {/* Gallery Section */}
          <div>
            <h3 style={{ color: '#FF006B', marginBottom: '20px' }}>Recent Uploads</h3>
            {filteredUploadedArtworks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px dashed #333' }}>
                <p style={{ color: '#ccc', fontSize: '1.2em', margin: 0 }}>No artworks found matching your criteria.</p>
              </div>
            ) : (
              <>
                <MasonryGrid isMobile={isMobile} gridSize={gridSize} style={filterTransitionStyles}>
                  {filteredUploadedArtworks.slice(0, displayCountGallery).map((artwork) => (
                    <ArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      onClick={setSelectedArtwork}
                      onEdit={handleEditArtworkTitle}
                      onDelete={handleDeleteArtwork}
                      type="gallery"
                    />
                  ))}
                </MasonryGrid>
                {displayCountGallery < filteredUploadedArtworks.length && (
                  <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button
                      onClick={() => setDisplayCountGallery(prev => prev + ARTWORKS_PER_PAGE)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#45FFEF',
                        border: '1px solid #45FFEF',
                        padding: '12px 30px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFEF'; e.target.style.color = 'black'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#45FFEF'; }}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
            </>
          )}

          {/* For You View */}
          {activeNav === 'for-you' && (
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>For You</h2>
              <p style={{ color: '#ccc', marginBottom: '20px' }}>Discover new artists and trending artworks tailored to your taste.</p>
              
              {renderCategoryFilters()}

              {filteredRecommendedArtworks.filter(art => activeCategoryFilter === 'All' || art.category === activeCategoryFilter || (!art.category && activeCategoryFilter === 'Illustrations')).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px dashed #333', marginTop: '20px' }}>
                  <p style={{ color: '#ccc', fontSize: '1.2em', margin: 0 }}>No artworks found matching your criteria.</p>
                </div>
              ) : (
                <>
                  {categoriesToRender.map(category => {
                    const categoryArtworks = filteredRecommendedArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations'));
                    if (categoryArtworks.length === 0) return null;
                    
                    return (
                      <div key={category} style={{ marginBottom: '50px' }}>
                        <h3 style={{ color: '#45FFEF', fontSize: '1.5em', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>{category}</h3>
                        <MasonryGrid isMobile={isMobile} gridSize={gridSize} style={filterTransitionStyles}>
                          {categoryArtworks.slice(0, displayCountForYou).map((artwork) => (
                            <ArtworkCard
                              key={`foryou-${artwork.id}`}
                              artwork={artwork}
                              onClick={setSelectedArtwork}
                              onToggleFavorite={toggleFavorite}
                              isFavorite={favoriteArtworks.some(art => art.id === artwork.id)}
                              type="foryou"
                            />
                          ))}
                        </MasonryGrid>
                      </div>
                    );
                  })}
                  
                  {categoriesToRender.some(category => 
                    filteredRecommendedArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations')).length > displayCountForYou
                  ) && (
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <button
                        onClick={() => setDisplayCountForYou(prev => prev + ARTWORKS_PER_PAGE)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#45FFEF',
                          border: '1px solid #45FFEF',
                          padding: '12px 30px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFEF'; e.target.style.color = 'black'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#45FFEF'; }}
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* My Gallery View */}
          {activeNav === 'gallery' && (
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>My Gallery</h2>
              <p style={{ color: '#ccc', marginBottom: '20px' }}>All your stored artworks, beautifully organized.</p>
              
              {renderCategoryFilters()}

              {filteredUploadedArtworks.filter(art => activeCategoryFilter === 'All' || art.category === activeCategoryFilter || (!art.category && activeCategoryFilter === 'Illustrations')).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px dashed #333', marginTop: '20px' }}>
                  <p style={{ color: '#ccc', fontSize: '1.2em', margin: 0 }}>No artworks found matching your criteria.</p>
                </div>
              ) : (
                <>
                  {categoriesToRender.map(category => {
                    const categoryArtworks = filteredUploadedArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations'));
                    if (categoryArtworks.length === 0) return null;
                    
                    return (
                      <div key={category} style={{ marginBottom: '50px' }}>
                        <h3 style={{ color: '#45FFEF', fontSize: '1.5em', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>{category}</h3>
                        <MasonryGrid isMobile={isMobile} gridSize={gridSize} style={filterTransitionStyles}>
                          {categoryArtworks.slice(0, displayCountGallery).map((artwork) => (
                            <ArtworkCard
                              key={`gallery-${artwork.id}`}
                              artwork={artwork}
                              onClick={setSelectedArtwork}
                              onEdit={handleEditArtworkTitle}
                              onDelete={handleDeleteArtwork}
                              type="gallery"
                            />
                          ))}
                        </MasonryGrid>
                      </div>
                    );
                  })}
                  
                  {categoriesToRender.some(category => 
                    filteredUploadedArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations')).length > displayCountGallery
                  ) && (
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <button
                        onClick={() => setDisplayCountGallery(prev => prev + ARTWORKS_PER_PAGE)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#45FFEF',
                          border: '1px solid #45FFEF',
                          padding: '12px 30px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFEF'; e.target.style.color = 'black'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#45FFEF'; }}
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Profile View */}
          {activeNav === 'profile' && (
            <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>My Profile</h2>
              <p style={{ color: '#ccc', marginBottom: '40px' }}>Manage your personal information and settings.</p>
              
              <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #857AFF',
                borderRadius: '15px',
                padding: isMobile ? '20px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
              }}>
                {/* Avatar and Basic Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                  <div 
                    onClick={() => document.getElementById('avatar-upload').click()}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid #45FFEF', overflow: 'hidden', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    title="Click to change avatar"
                  >
                    <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/png, image/jpeg, image/gif" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const MAX_SIZE = 300;
                              let { width, height } = img;
                              
                              if (width > height && width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                              } else if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                              }
                              
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              ctx.drawImage(img, 0, 0, width, height);
                              
                              // Convert back to base64 as a JPEG with 70% quality
                              setAvatar(canvas.toDataURL('image/jpeg', 0.7));
                            };
                            img.src = event.target.result;
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '2em', color: '#FF006B', margin: '0 0 10px 0' }}>{user?.name || 'Artist'}</h3>
                    <p style={{ color: '#857AFF', margin: 0, fontSize: '1.1em' }}>{user?.email || 'artist@mo-draws.com'}</p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                      <span style={{ color: '#ccc' }}><strong style={{ color: '#45FFEF' }}>1.2K</strong> Followers</span>
                      <span style={{ color: '#ccc' }}><strong style={{ color: '#45FFEF' }}>348</strong> Following</span>
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #333', width: '100%' }} />

                {/* Form */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#857AFF', fontSize: '14px' }}>Display Name</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                        style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px', paddingRight: '35px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} 
                        onFocus={(e) => e.target.style.borderColor = '#45FFEF'} 
                        onBlur={(e) => e.target.style.borderColor = '#333'} 
                      />
                      {profileForm.name.trim().split(/\s+/).length >= 2 && (
                        <div style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#45FFEF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'modalContentFadeIn 0.2s ease-out'
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#857AFF', fontSize: '14px' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="email" 
                        value={profileForm.email} 
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                        style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px', paddingRight: '35px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} 
                        onFocus={(e) => e.target.style.borderColor = '#45FFEF'} 
                        onBlur={(e) => e.target.style.borderColor = '#333'} 
                      />
                      {profileForm.email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email) && (
                        <div style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#45FFEF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'modalContentFadeIn 0.2s ease-out'
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#857AFF', fontSize: '14px' }}>Bio</label>
                    <textarea 
                      rows="4" 
                      value={profileForm.bio} 
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} 
                      style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#45FFEF'} 
                      onBlur={(e) => e.target.style.borderColor = '#333'}
                    ></textarea>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#857AFF', fontSize: '14px' }}>Portfolio Website</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="url" 
                        value={profileForm.portfolio} 
                        onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })} 
                        style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px', paddingRight: '35px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} 
                        onFocus={(e) => e.target.style.borderColor = '#45FFEF'} 
                        onBlur={(e) => e.target.style.borderColor = '#333'} 
                      />
                      {profileForm.portfolio.startsWith('https://') && profileForm.portfolio.length > 8 && (
                        <div style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#45FFEF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'modalContentFadeIn 0.2s ease-out'
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button 
                      onClick={() => {
                        if (profileForm.portfolio && !profileForm.portfolio.startsWith('https://')) {
                          showToast('Portfolio Website must start with https://');
                          return;
                        }
                        if (onUpdateUser) {
                          onUpdateUser({ name: profileForm.name, email: profileForm.email });
                        }
                        localStorage.setItem('userBio', profileForm.bio);
                        localStorage.setItem('userPortfolio', profileForm.portfolio);
                        showToast('Profile updated successfully!');
                      }}
                    style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #45FFEF', padding: '12px 30px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFEF'; e.target.style.color = 'black'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'; }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Favorites View */}
          {activeNav === 'favorites' && (
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>Favorites</h2>
              <p style={{ color: '#ccc', marginBottom: '20px' }}>Artworks from other creators that inspire you.</p>
              
              {renderCategoryFilters()}

              {filteredFavoriteArtworks.filter(art => activeCategoryFilter === 'All' || art.category === activeCategoryFilter || (!art.category && activeCategoryFilter === 'Illustrations')).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px dashed #333', marginTop: '20px' }}>
                  <p style={{ color: '#ccc', fontSize: '1.2em', margin: 0 }}>No artworks found matching your criteria.</p>
                </div>
              ) : (
                <>
                  {categoriesToRender.map(category => {
                    const categoryArtworks = filteredFavoriteArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations'));
                    if (categoryArtworks.length === 0) return null;
                    
                    return (
                      <div key={category} style={{ marginBottom: '50px' }}>
                        <h3 style={{ color: '#45FFEF', fontSize: '1.5em', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>{category}</h3>
                        <MasonryGrid isMobile={isMobile} gridSize={gridSize} style={filterTransitionStyles}>
                          {categoryArtworks.slice(0, displayCountFavorites).map((artwork) => (
                            <ArtworkCard
                              key={`fav-${artwork.id}`}
                              artwork={artwork}
                              onClick={setSelectedArtwork}
                              type="favorite"
                            />
                          ))}
                        </MasonryGrid>
                      </div>
                    );
                  })}
                  
                  {categoriesToRender.some(category => 
                    filteredFavoriteArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations')).length > displayCountFavorites
                  ) && (
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <button
                        onClick={() => setDisplayCountFavorites(prev => prev + ARTWORKS_PER_PAGE)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#45FFEF',
                          border: '1px solid #45FFEF',
                          padding: '12px 30px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFEF'; e.target.style.color = 'black'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#45FFEF'; }}
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Followers View */}
          {activeNav === 'followers' && (
            <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>Followers</h2>
              <p style={{ color: '#ccc', marginBottom: '40px' }}>People who love and support your artwork.</p>
              
              {filteredFollowersList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px dashed #333' }}>
                  <p style={{ color: '#ccc', fontSize: '1.2em' }}>You don't have any followers yet.</p>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '15px',
                  ...filterTransitionStyles
                }}>
                  {filteredFollowersList.map((follower) => (
                    <div key={`follower-${follower.id}`} style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#857AFF'; e.currentTarget.style.backgroundColor = '#222'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img src={follower.avatar} alt={follower.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #45FFEF', objectFit: 'cover' }} />
                        <div>
                          <h4 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '1.1em' }}>{follower.name}</h4>
                          <p style={{ color: '#857AFF', margin: 0, fontSize: '14px' }}>{follower.handle}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleFollow(follower.id)}
                        style={{ 
                          backgroundColor: follower.isFollowing ? '#45FFEF' : 'transparent', 
                          color: follower.isFollowing ? 'black' : '#45FFEF', 
                          border: '1px solid #45FFEF', 
                          padding: '8px 20px', 
                          borderRadius: '25px', 
                          cursor: 'pointer', 
                          fontWeight: 'bold', 
                          transition: 'all 0.2s ease' 
                        }}
                        onMouseEnter={(e) => { 
                          if (!follower.isFollowing) {
                            e.target.style.backgroundColor = '#45FFEF'; 
                            e.target.style.color = 'black'; 
                          } else {
                            e.target.style.backgroundColor = 'transparent'; 
                            e.target.style.color = '#45FFEF';
                          }
                        }}
                        onMouseLeave={(e) => { 
                          if (!follower.isFollowing) {
                            e.target.style.backgroundColor = 'transparent'; 
                            e.target.style.color = '#45FFEF'; 
                          } else {
                            e.target.style.backgroundColor = '#45FFEF'; 
                            e.target.style.color = 'black';
                          }
                        }}
                      >
                        {follower.isFollowing ? 'Following' : 'Follow Back'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings View */}
          {activeNav === 'settings' && (
            <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>Settings</h2>
              <p style={{ color: '#ccc', marginBottom: '40px' }}>Customize your app experience and privacy preferences.</p>
              
              <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #857AFF',
                borderRadius: '15px',
                padding: isMobile ? '20px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px'
              }}>
                {/* Account Preferences */}
                <div>
                  <h3 style={{ color: '#45FFEF', fontSize: '1.2em', margin: '0 0 20px 0', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Account Preferences</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '1.1em' }}>Email Notifications</h4>
                      <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Receive updates about your artwork and followers.</p>
                    </div>
                    <div 
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      style={{ width: '50px', height: '26px', backgroundColor: emailNotifications ? '#857AFF' : '#333', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                    >
                      <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: emailNotifications ? '27px' : '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 0.3s ease' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '1.1em' }}>Public Profile</h4>
                      <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Allow anyone to view your gallery and profile.</p>
                    </div>
                    <div 
                      onClick={() => setPublicProfile(!publicProfile)}
                      style={{ width: '50px', height: '26px', backgroundColor: publicProfile ? '#857AFF' : '#333', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                    >
                      <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: publicProfile ? '27px' : '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 0.3s ease' }}></div>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div>
                  <h3 style={{ color: '#45FFEF', fontSize: '1.2em', margin: '0 0 20px 0', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Appearance</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ color: accentColor, fontSize: '14px', transition: 'color 0.3s ease' }}>Base Theme</label>
                      <CustomSelect 
                        value={appTheme}
                        onChange={setAppTheme}
                        options={[
                          { value: 'dark', label: 'Dark Mode (Default)' },
                          { value: 'light', label: 'Light Mode' },
                          { value: 'system', label: 'System Default' }
                        ]}
                        triggerStyle={{
                          backgroundColor: '#111', 
                          border: '1px solid #333', 
                          borderRadius: '8px', 
                          padding: '12px', 
                          color: 'white',
                          hoverColor: '#45FFEF'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ color: accentColor, fontSize: '14px', transition: 'color 0.3s ease' }}>Accent Color</label>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        {['#857AFF', '#FF006B', '#45FFEF', '#00E5FF', '#FFB800'].map(color => (
                          <button 
                            key={color}
                            onClick={() => setAccentColor(color)}
                            style={{
                              width: '36px', 
                              height: '36px', 
                              borderRadius: '50%', 
                              backgroundColor: color, 
                              cursor: 'pointer',
                              border: accentColor === color ? '3px solid white' : '3px solid transparent',
                              boxShadow: accentColor === color ? `0 0 15px ${color}` : 'none',
                              transition: 'all 0.2s ease',
                              padding: 0
                            }}
                            title={`Set accent color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 style={{ color: '#FF006B', fontSize: '1.2em', margin: '0 0 20px 0', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Danger Zone</h3>
                  <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>Once you delete your account, there is no going back. Please be certain.</p>
                  <button 
                    onClick={handleDeleteAccount}
                    style={{ backgroundColor: 'transparent', color: '#FF006B', border: '1px solid #FF006B', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#FF006B'; e.target.style.color = 'black'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#FF006B'; }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>

        {/* Footer */}
        <footer style={{ padding: isMobile ? '30px 20px' : '50px 20px', backgroundColor: '#111', color: 'white', borderTop: '1px solid #857AFF', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'space-between', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: isMobile ? '20px' : '30px', maxWidth: '1000px', margin: '0 auto', textAlign: isMobile ? 'center' : 'left' }}>
            
            {/* 1. Logo */}
            <div style={{ flex: '1', minWidth: '150px', marginBottom: isMobile ? '10px' : '20px' }}>
              <a href="/" onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState(null, '', '/'); 
                window.dispatchEvent(new PopStateEvent('popstate')); 
              }} style={{ textDecoration: 'none' }}>
                <h2 style={{ fontSize: '2.5em', margin: '0' }}>
                  <span style={{ color: '#FF006B' }}>Mo</span>
                  <span style={{ color: '#857AFF' }}>Draws</span>
                </h2>
              </a>
            </div>

            {/* 2. Things you can do */}
            <div style={{ flex: '1', minWidth: '150px', marginBottom: isMobile ? '10px' : '20px' }}>
              <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Built For Creatives</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: isMobile ? 'center' : 'flex-start' }}>
                <FooterLink href="#features">Upload Art</FooterLink>
                <FooterLink href="#features">Build Portfolio</FooterLink>
            <FooterLink href="/about">Join Community</FooterLink>
              </div>
            </div>

            {/* 3. Talents */}
            <div style={{ flex: '1', minWidth: '150px', marginBottom: isMobile ? '10px' : '20px' }}>
              <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Find Talent</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: isMobile ? 'center' : 'flex-start' }}>
                <FooterLink href="#hero">Illustrations</FooterLink>
                <FooterLink href="#hero">Concept Arts</FooterLink>
                <FooterLink href="#hero">Animations</FooterLink>
                <FooterLink href="#hero">Video Edits</FooterLink>
                <FooterLink href="#hero">Graphic Designs</FooterLink>
              </div>
            </div>

            {/* 4. About */}
            <div style={{ flex: '1', minWidth: '150px', marginBottom: isMobile ? '10px' : '20px' }}>
              <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Mo-Draws</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: isMobile ? 'center' : 'flex-start' }}>
                <FooterLink href="/aboutuspage">About Us</FooterLink>
                <FooterLink href="#features">Careers</FooterLink>
                <FooterLink href="#faq">Guidelines</FooterLink>
                <FooterLink href="#faq">Help centre</FooterLink>
                <FooterLink href="#creator">Our Team</FooterLink>
              </div>
            </div>
          
            {/* 5. Social Media */}
            <div style={{ flex: '1', minWidth: '150px', marginBottom: isMobile ? '10px' : '20px' }}>
              <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '15px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
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
          
          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #333' }}>
            <p style={{ fontSize: '0.8em', margin: 0, color: '#ccc' }}>&copy; {new Date().getFullYear()} Mo-Draws. All rights reserved.</p>
          </div>
        </footer>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedArtwork && (
        <div 
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            animation: isClosing ? 'backdropFadeOut 0.3s ease forwards' : 'backdropFadeIn 0.3s ease forwards'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90vh',
              backgroundColor: '#111',
              border: `2px solid ${accentColor}`,
              borderRadius: '15px',
              padding: '15px',
              boxShadow: `0 10px 40px ${accentColor}40`,
              display: 'flex',
              flexDirection: 'column',
              animation: isClosing ? 'modalContentFadeOut 0.3s ease forwards' : 'modalContentFadeIn 0.3s ease forwards'
            }}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: isMobile ? '-10px' : '-15px',
                right: isMobile ? '-10px' : '-15px',
                backgroundColor: '#FF006B',
                color: 'white',
                border: '2px solid #111',
                borderRadius: '50%',
                width: isMobile ? '30px' : '36px',
                height: isMobile ? '30px' : '36px',
                cursor: 'pointer',
                fontSize: isMobile ? '16px' : '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(255,0,107,0.3)',
                zIndex: 10
              }}
            >
              ×
            </button>

            {currentGallery.length > 1 && (
              <>
                <button
                  onClick={goToPrevArtwork}
                  style={{
                    position: 'absolute',
                    left: isMobile ? '5px' : '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    border: `1px solid ${accentColor}`,
                    borderRadius: '50%',
                    width: isMobile ? '32px' : '40px',
                    height: isMobile ? '32px' : '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '14px' : '20px',
                    transition: 'all 0.2s ease',
                    zIndex: 15
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = accentColor;
                    e.currentTarget.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  &#10094;
                </button>
                <button
                  onClick={goToNextArtwork}
                  style={{
                    position: 'absolute',
                    right: isMobile ? '5px' : '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    border: `1px solid ${accentColor}`,
                    borderRadius: '50%',
                    width: isMobile ? '32px' : '40px',
                    height: isMobile ? '32px' : '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '14px' : '20px',
                    transition: 'all 0.2s ease',
                    zIndex: 15
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = accentColor;
                    e.currentTarget.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  &#10095;
                </button>
              </>
            )}

            {imageLoading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${accentColor}40`,
                  borderTop: `4px solid ${accentColor}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            )}

            <img 
              src={selectedArtwork.thumbnail} 
              alt={selectedArtwork.title} 
              onLoad={() => setImageLoading(false)}
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 80px)',
                objectFit: 'contain',
                borderRadius: '8px',
                opacity: imageLoading ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#45FFEF', fontSize: '1.5em' }}>{selectedArtwork.title}</h3>
              <p style={{ margin: 0, color: '#857AFF', fontSize: '14px' }}>
                {selectedArtwork.author ? `by ${selectedArtwork.author}` : selectedArtwork.date}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderLeft: `4px solid ${accentColor}`,
          borderRadius: '8px',
          padding: '15px 20px',
          color: 'white',
          boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: isToastClosing ? 'toastSlideOut 0.3s ease-in forwards' : 'toastSlideIn 0.3s ease-out forwards'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span style={{ fontSize: '14px', fontWeight: 'bold', flex: 1, marginRight: '10px' }}>{toastMessage}</span>
          <button 
            onClick={closeToast}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aaa',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
            title="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
