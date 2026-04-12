import React, { useState, useEffect, useRef } from 'react';

const FooterLink = ({ href, children, category }) => {
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
      const url = category ? `${href}?category=${encodeURIComponent(category)}` : href;
      window.history.pushState(null, '', url);
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

const parseCount = (count) => {
  if (count === undefined || count === null) return 0;
  if (typeof count === 'number') return count;
  if (typeof count === 'string') {
    const upper = count.toUpperCase();
    if (upper.endsWith('K')) return parseFloat(upper) * 1000;
    if (upper.endsWith('M')) return parseFloat(upper) * 1000000;
    return parseInt(count, 10) || 0;
  }
  return 0;
};

const DASHBOARD_UPLOAD_DB_NAME = 'mo-draws-dashboard-db';
const DASHBOARD_UPLOAD_STORE_NAME = 'uploaded-artworks';
const DASHBOARD_UPLOAD_RECORD_KEY = 'items';

const openDashboardUploadDb = () =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DASHBOARD_UPLOAD_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DASHBOARD_UPLOAD_STORE_NAME)) {
        db.createObjectStore(DASHBOARD_UPLOAD_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getUploadedArtworksFromDb = async () => {
  const db = await openDashboardUploadDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DASHBOARD_UPLOAD_STORE_NAME, 'readonly');
    const store = tx.objectStore(DASHBOARD_UPLOAD_STORE_NAME);
    const request = store.get(DASHBOARD_UPLOAD_RECORD_KEY);

    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
    request.onerror = () => reject(request.error);
  });
};

const saveUploadedArtworksToDb = async (items) => {
  const db = await openDashboardUploadDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DASHBOARD_UPLOAD_STORE_NAME, 'readwrite');
    const store = tx.objectStore(DASHBOARD_UPLOAD_STORE_NAME);
    store.put(items, DASHBOARD_UPLOAD_RECORD_KEY);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

const PORTFOLIO_DB_NAME = 'mo-draws-portfolio-db';
const PORTFOLIO_STORE_NAME = 'portfolio';
const PORTFOLIO_RECORD_KEY = 'items';

const openPortfolioDb = () =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open(PORTFOLIO_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PORTFOLIO_STORE_NAME)) {
        db.createObjectStore(PORTFOLIO_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const savePortfolioItemsToDb = async (items) => {
  const db = await openPortfolioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PORTFOLIO_STORE_NAME, 'readwrite');
    const store = tx.objectStore(PORTFOLIO_STORE_NAME);
    store.put(items, PORTFOLIO_RECORD_KEY);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

const formatCount = (count) => {
  const num = parseCount(count);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const InfiniteScrollTrigger = ({ onLoadMore, hasMore }) => {
  const observerTarget = useRef(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: '100px' } // Trigger slightly before it comes into full view
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  return hasMore ? (
    <div ref={observerTarget} style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <div style={{ width: '24px', height: '24px', border: '3px solid rgba(133, 122, 255, 0.3)', borderTop: '3px solid #857AFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  ) : null;
};

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
  onAuthorClick,
  type = 'gallery',
  draggable,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const hoverBorderColor = type === 'gallery' ? '#45FFEF' : '#FF006B';
  const hoverBoxShadow = type === 'gallery' 
    ? '0 10px 20px rgba(69, 255, 239, 0.1)' 
    : '0 10px 20px rgba(255, 0, 107, 0.15)';

  return (
    <div 
      onClick={() => onClick(artwork)}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
        <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', color: artwork.visibility === 'Private' ? '#FFB800' : '#45FFEF', border: `1px solid ${artwork.visibility === 'Private' ? '#FFB800' : '#45FFEF'}`, zIndex: 10, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {artwork.visibility === 'Private' ? '🔒 Private' : '🌍 Public'}
        </div>
      )}

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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "#FF006B" : "none"} stroke="#FF006B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: isFavorite ? 'heartPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h4 style={{ color: '#FF006B', margin: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, paddingRight: '10px' }}>{artwork.title}</h4>
          <div style={{ display: 'flex', gap: '8px', color: '#aaa', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title={`${parseCount(artwork.views)} views`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              {formatCount(artwork.views)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title={`${parseCount(artwork.likes)} likes`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              {formatCount(artwork.likes)}
            </span>
          </div>
        </div>
        <p style={{ color: '#857AFF', margin: '0', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {type === 'gallery' ? artwork.date : (
            <span 
              onClick={(e) => {
                if (onAuthorClick) {
                  e.stopPropagation();
                  onAuthorClick(artwork.author);
                }
              }}
              style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
              onMouseLeave={(e) => e.target.style.color = '#857AFF'}
              title={`View ${artwork.author}'s profile`}
            >
              by {artwork.author}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

const DashboardPage = ({ user, onLogout, onUpdateUser }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [artworkTitle, setArtworkTitle] = useState('');
  const [artworkCategory, setArtworkCategory] = useState('Illustrations');
  const [addToPortfolio, setAddToPortfolio] = useState(false);
  const [uploadedArtworks, setUploadedArtworks] = useState([
    {
      id: 1,
      title: 'Digital Illustration 1',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=300&q=80',
      date: 'Mar 20, 2026',
      category: 'Illustrations',
      visibility: 'Public',
      views: '1.2K',
      likes: '342'
    },
    {
      id: 2,
      title: 'Character Design',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80',
      date: 'Mar 18, 2026',
      category: 'Concept Arts',
      visibility: 'Private',
      views: '856',
      likes: '124'
    }
  ]);
  const [uploadedArtworksLoaded, setUploadedArtworksLoaded] = useState(false);
  
  const [favoriteArtworks, setFavoriteArtworks] = useLocalStorage('favoriteArtworks', [
    {
      id: 101,
      title: 'Neon Nights',
      author: 'CyberArtist99',
      thumbnail: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=300&q=80',
      views: '3.4K',
      likes: '892'
    },
    {
      id: 102,
      title: 'Abstract Dimensions',
      author: 'PolyRenderer',
      thumbnail: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=300&q=80',
      views: '12.1K',
      likes: '2.3K'
    },
    {
      id: 103,
      title: 'Synthwave Portrait',
      author: 'RetroDreamer',
      thumbnail: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=300&q=80',
      views: '5.6K',
      likes: '1.1K'
    }
  ]);

  const [followersList, setFollowersList] = useLocalStorage('followersList', [
    { id: 201, name: 'Alex River', handle: '@ariver_art', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', isFollowing: false, bio: 'Digital artist & illustrator. Lover of all things sci-fi.', isOnline: true },
    { id: 202, name: 'Sam Chen', handle: '@samc_draws', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', isFollowing: true, bio: 'Concept artist working in the games industry. Synthwave enthusiast.', isOnline: false },
    { id: 203, name: 'Jordan Lee', handle: '@jordan_concepts', avatar: 'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?auto=format&fit=crop&w=100&q=80', isFollowing: false, bio: '3D character modeler. Always learning, always creating.', isOnline: true }
  ]);
  const [blockedUsers, setBlockedUsers] = useLocalStorage('blockedUsers', []);
  const [mutedUsers, setMutedUsers] = useLocalStorage('mutedUsers', []);

  const [recommendedArtworks, setRecommendedArtworks] = useLocalStorage('recommendedArtworks', [
    {
      id: 301,
      title: 'Cyber City',
      author: 'NeonDreamer',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
      views: '8.9K',
      likes: '1.5K'
    },
    {
      id: 302,
      title: 'Holographic Dreams',
      author: 'VaporWave',
      thumbnail: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=300&q=80',
      views: '2.1K',
      likes: '456'
    },
    {
      id: 303,
      title: 'Space Station Alpha',
      author: 'StarGazer',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
      views: '4.5K',
      likes: '988'
    },
    {
      id: 304,
      title: 'Glitch Art #4',
      author: 'PixelMage',
      thumbnail: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791d?auto=format&fit=crop&w=300&q=80',
      views: '6.7K',
      likes: '1.2K'
    }
  ]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showAllNavItems, setShowAllNavItems] = useState(false);
  const [activeNav, setActiveNav] = useLocalStorage('activeNav', () => {
    const path = window.location.pathname.substring(1);
    const validPaths = ['dashboard', 'for-you', 'gallery', 'profile', 'favorites', 'followers', 'messages', 'settings'];
    if (validPaths.includes(path)) return path;
    return 'dashboard';
  }, false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationReadStatus, setNotificationReadStatus] = useLocalStorage('notificationReadStatus', {});
  const [clearedNotifications, setClearedNotifications] = useLocalStorage('clearedNotifications', {});
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [artworkComments, setArtworkComments] = useLocalStorage('artworkComments', {
    1: [{ id: 1, author: 'NeonDreamer', text: 'The neon lighting is incredible!', time: '2 days ago' }],
    301: [{ id: 2, author: 'CyberArtist99', text: 'This composition is so inspiring.', time: '1 week ago' }]
  });
  
  // Generate notifications dynamically from live data
  const generateNotifications = () => {
    const notifs = [];

    // Add follow notifications based on current followers
    const recentFollowers = followersList.slice(0, 10); // Show recent followers
    recentFollowers.forEach((follower) => {
      const notifId = `follow_${follower.id}`;
      // Skip if cleared
      if (clearedNotifications[notifId]) return;
      notifs.push({
        id: notifId,
        text: `${follower.name} started following you.`,
        time: 'just now',
        read: notificationReadStatus[notifId] === true,
      });
    });

    // Add like notifications from recent artworks
    uploadedArtworks.slice(0, 5).forEach((artwork) => {
      const likes = parseCount(artwork.likes);
      if (likes > 0) {
        const notifId = `likes_${artwork.id}`;
        // Skip if cleared
        if (clearedNotifications[notifId]) return;
        const likeText = likes === 1 ? 'Someone liked' : `${likes} people liked`;
        notifs.push({
          id: notifId,
          text: `${likeText} your artwork "${artwork.title}".`,
          time: 'recently',
          read: notificationReadStatus[notifId] === true,
        });
      }
    });

    // Add comment notifications
    Object.entries(artworkComments).forEach(([artworkId, comments]) => {
      if (comments && comments.length > 0) {
        const artwork = uploadedArtworks.find(a => a.id === parseInt(artworkId));
        if (artwork) {
          const latestComment = comments[comments.length - 1];
          const notifId = `comment_${artworkId}_${latestComment.id}`;
          // Skip if cleared
          if (clearedNotifications[notifId]) return;
          notifs.push({
            id: notifId,
            text: `${latestComment.author} commented on "${artwork.title}".`,
            time: latestComment.time || 'recently',
            read: notificationReadStatus[notifId] === true,
          });
        }
      }
    });

    // Add system welcome message
    const welcomeId = 'system_welcome';
    if (!clearedNotifications[welcomeId]) {
      notifs.push({
        id: welcomeId,
        text: 'System: Welcome to Mo-Draws! Start creating and sharing your artwork.',
        time: 'always',
        read: notificationReadStatus[welcomeId] === true,
      });
    }

    // Limit notifications to 50 most recent and sort by relevance
    return notifs.slice(0, 50);
  };

  const notifications = generateNotifications();
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  const [conversations, setConversations] = useLocalStorage('conversations', [
    { id: 1, user: { name: 'Alex River', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', isOnline: true }, messages: [{ id: 1, text: 'Hey, love your new artwork!', sender: 'them', time: '10:30 AM' }, { id: 2, text: 'Thanks Alex! Really appreciate it.', sender: 'me', time: '10:35 AM' }], unread: 0 },
    { id: 2, user: { name: 'Sam Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', isOnline: false }, messages: [{ id: 3, text: 'Are you open for commissions?', sender: 'them', time: 'Yesterday' }], unread: 1 }
  ]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [newChatMessage, setNewChatMessage] = useState('');
  const totalUnreadMessages = conversations.reduce((acc, curr) => acc + (curr.unread || 0), 0);

  const [isClosing, setIsClosing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [isFiltering, setIsFiltering] = useState(false);
  const [isNavLoading, setIsNavLoading] = useState(false);
  const hasMountedNavRef = useRef(false);
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
  const [displayCountFollowers, setDisplayCountFollowers] = useState(ARTWORKS_PER_PAGE);
  const [followerTab, setFollowerTab] = useState('followers');
  const [followerSearchQuery, setFollowerSearchQuery] = useState('');
  const [hoveredFollowerId, setHoveredFollowerId] = useState(null);
  const [userToUnfollow, setUserToUnfollow] = useState(null);
  const [viewingUserProfile, setViewingUserProfile] = useState(null);
  const [artworkVisibility, setArtworkVisibility] = useState('Public');
  const [visibilityFilter, setVisibilityFilter] = useState('All');
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
      const validPaths = ['dashboard', 'for-you', 'gallery', 'profile', 'favorites', 'followers', 'messages', 'settings'];
      if (validPaths.includes(path)) {
        setActiveNav(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveNav]);
  useEffect(() => {
    let isCancelled = false;

    const loadUploadedArtworks = async () => {
      try {
        const dbItems = await getUploadedArtworksFromDb();
        if (isCancelled) return;

        if (dbItems.length > 0) {
          setUploadedArtworks(dbItems);
        } else {
          const legacyItems = (() => {
            try {
              return JSON.parse(localStorage.getItem('uploadedArtworks') || '[]');
            } catch {
              return [];
            }
          })();

          if (legacyItems.length > 0) {
            setUploadedArtworks(legacyItems);
            saveUploadedArtworksToDb(legacyItems).catch((error) => {
              console.error('Failed to migrate uploaded artworks to IndexedDB:', error);
            });
            localStorage.removeItem('uploadedArtworks');
          }
        }
      } catch (error) {
        console.error('Failed to load uploaded artworks from IndexedDB:', error);
      } finally {
        if (!isCancelled) {
          setUploadedArtworksLoaded(true);
        }
      }
    };

    loadUploadedArtworks();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!uploadedArtworksLoaded) return;

    const saveUploadedArtworks = async () => {
      try {
        await saveUploadedArtworksToDb(uploadedArtworks);
        localStorage.setItem('uploadedArtworksMeta', JSON.stringify({
          count: uploadedArtworks.length,
          updatedAt: Date.now()
        }));
        localStorage.removeItem('uploadedArtworks');
      } catch (error) {
        console.error('Failed to save uploaded artworks to IndexedDB:', error);
      }
    };

    saveUploadedArtworks();
  }, [uploadedArtworks, uploadedArtworksLoaded]);

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
    setDisplayCountFollowers(ARTWORKS_PER_PAGE);
    setFollowerTab('followers');
    setActiveCategoryFilter('All');
    setFollowerSearchQuery('');
    setVisibilityFilter('All');
    
    // Check for category query parameter when navigating to "for-you"
    if (activeNav === 'for-you') {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      if (category) {
        setActiveCategoryFilter(category);
        // Clean up the URL by removing the query parameter
        window.history.replaceState(null, '', '/for-you');
      }
    }
  }, [activeNav]);

  useEffect(() => {
    if (!hasMountedNavRef.current) {
      hasMountedNavRef.current = true;
      return;
    }

    setIsNavLoading(true);
    const timer = setTimeout(() => setIsNavLoading(false), 260);
    return () => clearTimeout(timer);
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
  }, [searchQuery, followerSearchQuery, activeCategoryFilter, visibilityFilter, sortOrder, activeNav]);

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

  const handleOpenConversation = (id) => {
    setActiveConversationId(id);
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, unread: 0 } : conv
    ));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !activeConversationId) return;
    const newMessage = { id: Date.now(), text: newChatMessage.trim(), sender: 'me', time: 'Just now' };
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId ? { ...conv, messages: [...conv.messages, newMessage] } : conv
    ));
    setNewChatMessage('');
  };

  const handleSendImage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!activeConversationId) return;
        const newMessage = { id: Date.now(), text: '', image: reader.result, sender: 'me', time: 'Just now' };
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId ? { ...conv, messages: [...conv.messages, newMessage] } : conv
        ));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleStartChat = (userName) => {
    const follower = followersList.find(f => f.name === userName);
    const avatar = follower?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
    const isOnline = follower?.isOnline || false;
    let conv = conversations.find(c => c.user.name === userName);
    if (!conv) {
      conv = { id: Date.now(), user: { name: userName, avatar, isOnline }, messages: [], unread: 0 };
      setConversations(prev => [conv, ...prev]);
    }
    setViewingUserProfile(null);
    setActiveNav('messages');
    handleOpenConversation(conv.id);
    if (isMobile) setSidebarOpen(false);
  };

  const filteredUploadedArtworks = sortItems(uploadedArtworks.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.date.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility = visibilityFilter === 'All' || art.visibility === visibilityFilter || (!art.visibility && visibilityFilter === 'Public');
    return matchesSearch && matchesVisibility;
  }));

  const [draggedArtworkId, setDraggedArtworkId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedArtworkId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedArtworkId || draggedArtworkId === targetId) return;

    setUploadedArtworks(prev => {
      const draggedIndex = prev.findIndex(art => art.id === draggedArtworkId);
      const targetIndex = prev.findIndex(art => art.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      const newArtworks = [...prev];
      const [draggedItem] = newArtworks.splice(draggedIndex, 1);
      newArtworks.splice(targetIndex, 0, draggedItem);
      return newArtworks;
    });
    setDraggedArtworkId(null);
  };

  const filteredFavoriteArtworks = sortItems(favoriteArtworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.author.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const activeFollowersList = followerTab === 'followers' 
    ? followersList 
    : followersList.filter(f => f.isFollowing);

  const effectiveFollowerSearch = followerSearchQuery || searchQuery;

  const filteredFollowersList = sortItems(activeFollowersList.filter(follower => 
    follower.name.toLowerCase().includes(effectiveFollowerSearch.toLowerCase()) || 
    follower.handle.toLowerCase().includes(effectiveFollowerSearch.toLowerCase())
  ));

  const filteredRecommendedArtworks = sortItems(recommendedArtworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.author.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const totalUploadedViews = uploadedArtworks.reduce((total, artwork) => total + parseCount(artwork.views), 0);
  const followerCount = followersList.length;
  const followingCount = followersList.filter((follower) => follower.isFollowing).length;

  const resetUploadForm = () => {
    setPreviewImage(null);
    setArtworkTitle('');
    setArtworkCategory('Illustrations');
    setArtworkVisibility('Public');
    setAddToPortfolio(false);
    const uploadInput = document.getElementById('artwork-upload');
    if (uploadInput) uploadInput.value = '';
  };

  const addArtworkToPortfolio = async (artwork) => {
    const portfolioEntry = {
      id: Date.now(),
      type: 'artwork',
      layout: 'single',
      headingLevel: 'h2',
      textAlignVertical: 'center',
      title: artwork.title,
      description: `${artwork.category} • Uploaded from dashboard`,
      referenceLink: '',
      imageUrl: artwork.thumbnail,
      imageUrls: [artwork.thumbnail]
    };

    try {
      const savedItems = JSON.parse(localStorage.getItem('portfolioItems') || '[]');
      const nextItems = [portfolioEntry, ...savedItems];
      localStorage.setItem('portfolioItems', JSON.stringify(nextItems));
      localStorage.setItem('portfolioItemsMeta', JSON.stringify({
        count: nextItems.length,
        updatedAt: Date.now()
      }));

      savePortfolioItemsToDb(nextItems).catch((error) => {
        console.warn('IndexedDB save for portfolio item failed, using localStorage fallback.', error);
      });
      return true;
    } catch (error) {
      console.error('Failed to save artwork to portfolio database:', error);
      try {
        const fallback = JSON.parse(localStorage.getItem('portfolioItems') || '[]');
        localStorage.setItem('portfolioItems', JSON.stringify([portfolioEntry, ...fallback]));
        return true;
      } catch (storageError) {
        console.error('Fallback save to localStorage failed:', storageError);
        return false;
      }
    }
  };

  const handleUploadArtwork = async (e) => {
    e.preventDefault();

    const newArtwork = {
      id: uploadedArtworks.length + 1 + Math.random(),
      title: artworkTitle.trim() || `Artwork ${uploadedArtworks.length + 1}`,
      thumbnail: previewImage,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: artworkCategory,
      visibility: artworkVisibility,
      views: 0,
      likes: 0
    };

    setUploadedArtworks((prevArtworks) => [
      newArtwork,
      ...prevArtworks
    ]);

    if (artworkVisibility === 'Public') {
      setRecommendedArtworks((prev) => [
        { ...newArtwork, author: user?.name || 'Artist', category: artworkCategory },
        ...prev
      ]);
    }

    if (addToPortfolio) {
      const savedToPortfolio = await addArtworkToPortfolio(newArtwork);
      showToast(savedToPortfolio ? 'Artwork uploaded and added to portfolio.' : 'Artwork uploaded, but portfolio add failed.');
    } else {
      showToast('Artwork uploaded successfully!');
    }

    resetUploadForm();
  };

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
    const isFavorited = favoriteArtworks.some(art => art.id === artwork.id);
    
    const newLikes = parseCount(artwork.likes) + (isFavorited ? -1 : 1);
    const updateLikes = (prev) => prev.map(art =>
      art.id === artwork.id ? { ...art, likes: newLikes } : art
    );

    setUploadedArtworks(updateLikes);
    setRecommendedArtworks(updateLikes);

    if (isFavorited) {
      setFavoriteArtworks(prev => prev.filter(art => art.id !== artwork.id));
    } else {
      setFavoriteArtworks(prev => [{ ...artwork, likes: newLikes }, ...prev]);
    }
  };

  const handleToggleFollow = (id) => {
    setFollowersList(prev => prev.map(follower => 
      follower.id === id ? { ...follower, isFollowing: !follower.isFollowing } : follower
    ));
  };

  const handleBlockUser = (user) => {
    setBlockedUsers(prev => [...prev, user]);
    setFollowersList(prev => prev.filter(follower => follower.id !== user.id));
    setUserToUnfollow(null);
  };

  const handleUnblockUser = (userToUnblock) => {
    setBlockedUsers(prev => prev.filter(u => u.id !== userToUnblock.id));
    setFollowersList(prev => [...prev, { ...userToUnblock, isFollowing: false }]);
    showToast(`${userToUnblock.name} has been unblocked.`);
  };

  const handleMuteUser = (user) => {
    if (!mutedUsers.some(u => u.id === user.id)) {
      setMutedUsers(prev => [...prev, user]);
    }
    setUserToUnfollow(null);
  };

  const handleUnmuteUser = (userToUnmute) => {
    setMutedUsers(prev => prev.filter(u => u.id !== userToUnmute.id));
    showToast(`${userToUnmute.name} has been unmuted.`);
  };

  // Derived state for the slideshow modal
  const currentGallery = activeNav === 'favorites' ? filteredFavoriteArtworks : 
                         activeNav === 'for-you' ? filteredRecommendedArtworks : 
                         filteredUploadedArtworks;
  const selectedIndex = selectedArtwork ? currentGallery.findIndex(art => art.id === selectedArtwork.id) : -1;

  const handleArtworkClick = (artwork) => {
    const newViews = parseCount(artwork.views) + 1;
    const updateViews = (prev) => prev.map(art => 
      art.id === artwork.id ? { ...art, views: newViews } : art
    );
    
    setUploadedArtworks(updateViews);
    setRecommendedArtworks(updateViews);
    setFavoriteArtworks(updateViews);

    setSelectedArtwork({ ...artwork, views: newViews });
  };

  const goToNextArtwork = (e) => {
    e.stopPropagation();
    if (selectedIndex >= 0) {
      handleArtworkClick(currentGallery[(selectedIndex + 1) % currentGallery.length]);
    }
  };

  const goToPrevArtwork = (e) => {
    e.stopPropagation();
    if (selectedIndex >= 0) {
      handleArtworkClick(currentGallery[(selectedIndex - 1 + currentGallery.length) % currentGallery.length]);
    }
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      setSelectedArtwork(null);
      setNewComment('');
      setEditingCommentId(null);
      setEditCommentText('');
      setReplyingToId(null);
      setIsClosing(false);
    }, 300);
  };

  const handleSaveEditComment = (artworkId, commentId, parentId = null) => {
    if (!editCommentText.trim()) return;
    setArtworkComments(prev => ({
      ...prev,
      [artworkId]: parentId
        ? prev[artworkId].map(c => 
            c.id === parentId 
              ? { ...c, replies: (c.replies || []).map(r => r.id === commentId ? { ...r, text: editCommentText.trim(), time: 'Edited just now' } : r) }
              : c
          )
        : prev[artworkId].map(c => 
            c.id === commentId ? { ...c, text: editCommentText.trim(), time: 'Edited just now' } : c
          )
    }));
    setEditingCommentId(null);
    showToast('Comment updated successfully.');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: user?.name || 'Artist',
      text: newComment.trim(),
      time: 'Just now',
      replies: []
    };

    setArtworkComments(prev => {
      const currentComments = prev[selectedArtwork.id] || [];
      return {
        ...prev,
        [selectedArtwork.id]: replyingToId 
          ? currentComments.map(c => c.id === replyingToId ? { ...c, replies: [...(c.replies || []), comment] } : c)
          : [...currentComments, comment]
      };
    });
    setNewComment('');
    setReplyingToId(null);
  };

  const handleDeleteComment = (artworkId, commentId, parentId = null) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setArtworkComments(prev => ({
        ...prev,
        [artworkId]: parentId 
          ? prev[artworkId].map(c => c.id === parentId ? { ...c, replies: (c.replies || []).filter(r => r.id !== commentId) } : c)
          : prev[artworkId].filter(c => c.id !== commentId)
      }));
      showToast('Comment deleted successfully.');
    }
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
      localStorage.removeItem('notificationReadStatus');
      localStorage.removeItem('clearedNotifications');
      localStorage.removeItem('followersList');
      localStorage.removeItem('blockedUsers');
      localStorage.removeItem('mutedUsers');
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
    { id: 'jobs', label: 'Jobs', href: '/careers', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> },
    { id: 'favorites', label: 'Favorites', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> },
    { id: 'followers', label: 'Network', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { id: 'messages', label: 'Messages', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
    { id: 'settings', label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> }
  ];
  const NAV_ITEMS_LIMIT = 5;
  const visibleNavItems = showAllNavItems ? navItems : navItems.slice(0, NAV_ITEMS_LIMIT);

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
          @keyframes heartPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
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
      {isNavLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 130,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              border: '3px solid rgba(255, 255, 255, 0.25)',
              borderTopColor: '#45FFFF',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite'
            }}
          />
        </div>
      )}
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
              {visibleNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      window.history.pushState(null, '', item.href);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                      setActiveNav(item.id);
                    }
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
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.id === 'messages' && totalUnreadMessages > 0 && (
                    <span style={{ backgroundColor: '#FF006B', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>{totalUnreadMessages}</span>
                  )}
                </button>
              ))}
              {navItems.length > NAV_ITEMS_LIMIT && (
                <button
                  onClick={() => setShowAllNavItems(prev => !prev)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#45FFEF',
                    padding: '6px 4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left',
                    textDecoration: 'underline'
                  }}
                >
                  {showAllNavItems ? 'Show less' : `Show more (${navItems.length - NAV_ITEMS_LIMIT})`}
                </button>
              )}
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
                          onClick={() => {
                            const newReadStatus = { ...notificationReadStatus };
                            notifications.forEach(n => {
                              newReadStatus[n.id] = true;
                            });
                            setNotificationReadStatus(newReadStatus);
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#45FFEF', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                          Mark all read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button 
                          onClick={() => {
                            const newClearedStatus = { ...clearedNotifications };
                            notifications.forEach(n => {
                              newClearedStatus[n.id] = true;
                            });
                            setClearedNotifications(newClearedStatus);
                          }}
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
                          onClick={() => {
                            setNotificationReadStatus({
                              ...notificationReadStatus,
                              [notification.id]: true
                            });
                          }}
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
                              setClearedNotifications({
                                ...clearedNotifications,
                                [notification.id]: true
                              });
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

                  <CustomSelect
                    value={artworkVisibility}
                    onChange={setArtworkVisibility}
                    style={{ width: '100%', maxWidth: '250px', marginBottom: '20px' }}
                    options={[
                      { value: 'Public', label: 'Public (Visible to everyone)' },
                      { value: 'Private', label: 'Private (Only you)' }
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

                  <label
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      maxWidth: '250px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#ccc',
                      fontSize: '14px',
                      cursor: 'pointer',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={addToPortfolio}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setAddToPortfolio(e.target.checked)}
                      style={{ accentColor: '#45FFEF', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    Add this artwork to Build Portfolio
                  </label>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      onClick={(e) => { 
                        e.preventDefault();
                        resetUploadForm();
                      }} 
                      style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #FF006B', color: '#FF006B', borderRadius: '25px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUploadArtwork}
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
                <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>{formatCount(totalUploadedViews)}</h3>
                <p style={{ color: '#45FFEF', margin: 0 }}>Total Views</p>
              </div>
              <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #857AFF',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#FF006B', margin: '0 0 10px 0', fontSize: '2em' }}>{formatCount(followerCount)}</h3>
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
                      onClick={handleArtworkClick}
                      onEdit={handleEditArtworkTitle}
                      onDelete={handleDeleteArtwork}
                      type="gallery"
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, artwork.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, artwork.id)}
                    />
                  ))}
                </MasonryGrid>
                <InfiniteScrollTrigger 
                  hasMore={displayCountGallery < filteredUploadedArtworks.length} 
                  onLoadMore={() => setDisplayCountGallery(prev => prev + ARTWORKS_PER_PAGE)} 
                />
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
                              onClick={handleArtworkClick}
                              onToggleFavorite={toggleFavorite}
                              isFavorite={favoriteArtworks.some(art => art.id === artwork.id)}
                              onAuthorClick={setViewingUserProfile}
                              type="foryou"
                            />
                          ))}
                        </MasonryGrid>
                      </div>
                    );
                  })}
                  
                  <InfiniteScrollTrigger 
                    hasMore={categoriesToRender.some(category => 
                      filteredRecommendedArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations')).length > displayCountForYou
                    )} 
                    onLoadMore={() => setDisplayCountForYou(prev => prev + ARTWORKS_PER_PAGE)} 
                  />
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

              {/* Visibility Filters */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['All', 'Public', 'Private'].map(vis => (
                  <button
                    key={vis}
                    onClick={() => setVisibilityFilter(vis)}
                    style={{
                      backgroundColor: visibilityFilter === vis ? '#857AFF' : 'transparent',
                      color: visibilityFilter === vis ? 'white' : '#ccc',
                      border: `1px solid ${visibilityFilter === vis ? '#857AFF' : '#333'}`,
                      padding: '6px 15px',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {vis} {vis !== 'All' ? 'Artworks' : ''}
                  </button>
                ))}
              </div>

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
                              onClick={handleArtworkClick}
                              onEdit={handleEditArtworkTitle}
                              onDelete={handleDeleteArtwork}
                              type="gallery"
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, artwork.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, artwork.id)}
                            />
                          ))}
                        </MasonryGrid>
                      </div>
                    );
                  })}
                  
                  <InfiniteScrollTrigger 
                    hasMore={categoriesToRender.some(category => 
                      filteredUploadedArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations')).length > displayCountGallery
                    )} 
                    onLoadMore={() => setDisplayCountGallery(prev => prev + ARTWORKS_PER_PAGE)} 
                  />
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
                      <span style={{ color: '#ccc' }}><strong style={{ color: '#45FFEF' }}>{formatCount(followerCount)}</strong> Followers</span>
                      <span style={{ color: '#ccc' }}><strong style={{ color: '#45FFEF' }}>{formatCount(followingCount)}</strong> Following</span>
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
                              onClick={handleArtworkClick}
                              onAuthorClick={setViewingUserProfile}
                              type="favorite"
                            />
                          ))}
                        </MasonryGrid>
                      </div>
                    );
                  })}
                  
                  <InfiniteScrollTrigger 
                    hasMore={categoriesToRender.some(category => 
                      filteredFavoriteArtworks.filter(art => art.category === category || (!art.category && category === 'Illustrations')).length > displayCountFavorites
                    )} 
                    onLoadMore={() => setDisplayCountFavorites(prev => prev + ARTWORKS_PER_PAGE)} 
                  />
                </>
              )}
            </div>
          )}

          {/* Followers View */}
          {activeNav === 'followers' && (
            <div style={{ textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>Network</h2>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>People who love your art, and the artists you support.</p>
              
              {/* Tabs and Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => setFollowerTab('followers')}
                    style={{
                      backgroundColor: 'transparent',
                      color: followerTab === 'followers' ? '#45FFEF' : '#ccc',
                      border: 'none',
                      fontSize: '1.2em',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => { if (followerTab !== 'followers') e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { if (followerTab !== 'followers') e.target.style.color = '#ccc'; }}
                  >
                    Followers
                    {followerTab === 'followers' && (
                      <div style={{ position: 'absolute', bottom: '-16px', left: 0, right: 0, height: '3px', backgroundColor: '#45FFEF', borderRadius: '3px' }} />
                    )}
                  </button>
                  <button
                    onClick={() => setFollowerTab('following')}
                    style={{
                      backgroundColor: 'transparent',
                      color: followerTab === 'following' ? '#45FFEF' : '#ccc',
                      border: 'none',
                      fontSize: '1.2em',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => { if (followerTab !== 'following') e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { if (followerTab !== 'following') e.target.style.color = '#ccc'; }}
                  >
                    Following
                    {followerTab === 'following' && (
                      <div style={{ position: 'absolute', bottom: '-16px', left: 0, right: 0, height: '3px', backgroundColor: '#45FFEF', borderRadius: '3px' }} />
                    )}
                  </button>
                </div>
                
                {/* Local Search for Network */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#857AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px' }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search network..." 
                    value={followerSearchQuery}
                    onChange={(e) => setFollowerSearchQuery(e.target.value)}
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '20px',
                      padding: '8px 15px 8px 35px',
                      color: 'white',
                      outline: 'none',
                      width: isMobile ? '100%' : '200px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#45FFEF'}
                    onBlur={(e) => e.target.style.borderColor = '#333'}
                  />
                </div>
              </div>

              {filteredFollowersList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px dashed #333' }}>
                  <p style={{ color: '#ccc', fontSize: '1.2em', margin: 0 }}>
                    {effectiveFollowerSearch 
                      ? `No users found matching "${effectiveFollowerSearch}".` 
                      : followerTab === 'followers' ? "You don't have any followers yet." : "You aren't following anyone yet."}
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '20px',
                    ...filterTransitionStyles
                  }}>
                    {filteredFollowersList.slice(0, displayCountFollowers).map((follower) => (
                      <div key={`follower-${follower.id}`} style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.borderColor = '#857AFF'; 
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(133, 122, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.borderColor = '#333'; 
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        {/* Cover Image Background */}
                        <div style={{ 
                          height: '80px', 
                          backgroundImage: `url(${follower.avatar})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center', 
                          filter: 'blur(15px) brightness(0.6)' 
                        }} />
                        
                        {/* Profile Info */}
                        <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-40px' }}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img 
                              onClick={() => setViewingUserProfile(follower.name)}
                              src={follower.avatar} 
                              alt={follower.name} 
                              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #1a1a1a', objectFit: 'cover', zIndex: 1, backgroundColor: '#111', cursor: 'pointer', display: 'block' }} 
                            />
                            {follower.isOnline && (
                              <div style={{ position: 'absolute', bottom: '5px', right: '5px', width: '16px', height: '16px', backgroundColor: '#00FF66', border: '3px solid #1a1a1a', borderRadius: '50%', zIndex: 2 }} title="Online"></div>
                            )}
                          </div>
                          <h4 
                            onClick={() => setViewingUserProfile(follower.name)}
                            style={{ color: 'white', margin: '10px 0 5px 0', fontSize: '1.2em', cursor: 'pointer', transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
                            onMouseLeave={(e) => e.target.style.color = 'white'}
                          >
                            {follower.name}
                            {mutedUsers.some(u => u.id === follower.id) && (
                              <span style={{ backgroundColor: 'rgba(255, 184, 0, 0.15)', color: '#FFB800', border: '1px solid #FFB800', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Muted</span>
                            )}
                          </h4>
                          <p style={{ color: '#857AFF', margin: '0 0 10px 0', fontSize: '14px' }}>{follower.handle}</p>
                          <p style={{ color: '#aaa', margin: '0 0 20px 0', fontSize: '13px', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '30px' }}>
                            {follower.bio || 'No bio provided.'}
                          </p>
                          
                          <button 
                            onClick={() => {
                              if (follower.isFollowing) {
                                setUserToUnfollow(follower);
                              } else {
                                handleToggleFollow(follower.id);
                              }
                            }}
                            style={{ 
                              width: '100%',
                              backgroundColor: follower.isFollowing 
                                ? (hoveredFollowerId === follower.id ? 'rgba(255, 0, 107, 0.1)' : 'rgba(69, 255, 239, 0.1)') 
                                : (hoveredFollowerId === follower.id ? '#2CE6D6' : '#45FFEF'), 
                              color: follower.isFollowing 
                                ? (hoveredFollowerId === follower.id ? '#FF006B' : '#45FFEF') 
                                : 'black', 
                              border: `1px solid ${follower.isFollowing 
                                ? (hoveredFollowerId === follower.id ? '#FF006B' : '#45FFEF') 
                                : 'transparent'}`, 
                              padding: '10px 20px', 
                              borderRadius: '25px', 
                              cursor: 'pointer', 
                              fontWeight: 'bold', 
                              transition: 'all 0.2s ease' 
                            }}
                            onMouseEnter={() => setHoveredFollowerId(follower.id)}
                            onMouseLeave={() => setHoveredFollowerId(null)}
                          >
                            {follower.isFollowing 
                              ? (hoveredFollowerId === follower.id ? 'Unfollow' : 'Following') 
                              : 'Follow Back'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <InfiniteScrollTrigger 
                    hasMore={displayCountFollowers < filteredFollowersList.length} 
                    onLoadMore={() => setDisplayCountFollowers(prev => prev + ARTWORKS_PER_PAGE)} 
                  />
                </>
              )}
            </div>
          )}

          {/* Messages View */}
          {activeNav === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: isMobile ? 'calc(100vh - 150px)' : '600px' }}>
              <h2 style={{ fontSize: isMobile ? '2em' : '2.5em', marginBottom: '10px' }}>Messages</h2>
              <p style={{ color: '#ccc', marginBottom: '20px' }}>Connect and collaborate with other artists.</p>
              
              <div style={{ 
                display: 'flex', 
                flex: 1, 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #857AFF', 
                borderRadius: '15px', 
                overflow: 'hidden',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                 {/* Inbox Sidebar */}
                 {(!isMobile || !activeConversationId) && (
                   <div style={{ width: isMobile ? '100%' : '320px', borderRight: isMobile ? 'none' : '1px solid #333', borderBottom: isMobile ? '1px solid #333' : 'none', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
                       <h3 style={{ margin: 0, color: '#45FFEF', fontSize: '1.2em' }}>Inbox</h3>
                     </div>
                     <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                       {conversations.length === 0 ? (
                         <p style={{ color: '#ccc', textAlign: 'center', padding: '30px 20px' }}>No messages yet.</p>
                       ) : (
                         conversations.map(conv => (
                           <div 
                             key={conv.id}
                             onClick={() => handleOpenConversation(conv.id)}
                             style={{ 
                               padding: '15px 20px', 
                               borderBottom: '1px solid #222', 
                               cursor: 'pointer',
                               backgroundColor: activeConversationId === conv.id ? 'rgba(133, 122, 255, 0.15)' : 'transparent',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '15px',
                               transition: 'background-color 0.2s'
                             }}
                             onMouseEnter={(e) => { if (activeConversationId !== conv.id) e.currentTarget.style.backgroundColor = '#222'; }}
                             onMouseLeave={(e) => { if (activeConversationId !== conv.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                           >
                             <div style={{ position: 'relative', flexShrink: 0 }}>
                               <img src={conv.user.avatar} alt={conv.user.name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                               {conv.user.isOnline && (
                                 <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '12px', height: '12px', backgroundColor: '#00FF66', border: '2px solid #1a1a1a', borderRadius: '50%' }} title="Online"></div>
                               )}
                             </div>
                             <div style={{ flex: 1, overflow: 'hidden' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                 <h4 style={{ margin: 0, color: 'white', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.user.name}</h4>
                                 {conv.messages.length > 0 && <span style={{ fontSize: '11px', color: '#888' }}>{conv.messages[conv.messages.length - 1].time}</span>}
                               </div>
                               <p style={{ margin: '5px 0 0 0', color: conv.unread > 0 ? '#45FFEF' : '#aaa', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: conv.unread > 0 ? 'bold' : 'normal' }}>
                                 {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text : 'No messages yet...'}
                               </p>
                             </div>
                             {conv.unread > 0 && (
                               <span style={{ backgroundColor: '#FF006B', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>{conv.unread}</span>
                             )}
                           </div>
                         ))
                       )}
                     </div>
                   </div>
                 )}

                 {/* Active Chat Area */}
                 {(!isMobile || activeConversationId) && (
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#111' }}>
                     {activeConversationId ? (
                       <>
                         {/* Chat Header */}
                         <div style={{ padding: '15px 20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#1a1a1a' }}>
                           {isMobile && (
                             <button 
                               onClick={() => setActiveConversationId(null)}
                               style={{ background: 'none', border: 'none', color: '#45FFEF', fontSize: '24px', cursor: 'pointer', padding: '0 10px 0 0' }}
                             >
                               ←
                             </button>
                           )}
                           <div style={{ position: 'relative', flexShrink: 0 }}>
                             <img 
                               src={conversations.find(c => c.id === activeConversationId)?.user.avatar} 
                               alt="User" 
                               style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', display: 'block' }} 
                               onClick={() => setViewingUserProfile(conversations.find(c => c.id === activeConversationId)?.user.name)}
                             />
                             {conversations.find(c => c.id === activeConversationId)?.user.isOnline && (
                               <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '10px', height: '10px', backgroundColor: '#00FF66', border: '2px solid #1a1a1a', borderRadius: '50%' }} title="Online"></div>
                             )}
                           </div>
                           <h3 
                             style={{ margin: 0, color: 'white', fontSize: '16px', cursor: 'pointer' }}
                             onClick={() => setViewingUserProfile(conversations.find(c => c.id === activeConversationId)?.user.name)}
                           >
                             {conversations.find(c => c.id === activeConversationId)?.user.name}
                           </h3>
                         </div>

                         {/* Chat Messages */}
                         <div className="hide-scrollbar" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                           {conversations.find(c => c.id === activeConversationId)?.messages.length === 0 ? (
                             <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '14px' }}>
                               Say hi to {conversations.find(c => c.id === activeConversationId)?.user.name}!
                             </div>
                           ) : (
                             conversations.find(c => c.id === activeConversationId)?.messages.map(msg => (
                               <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                                 <div style={{ 
                                   backgroundColor: msg.image && !msg.text ? 'transparent' : (msg.sender === 'me' ? accentColor : '#222'), 
                                   color: msg.sender === 'me' ? 'black' : 'white',
                                   padding: msg.image && !msg.text ? '0' : '12px 18px', 
                                   borderRadius: '18px', 
                                   borderBottomRightRadius: msg.sender === 'me' ? '4px' : '18px',
                                   borderBottomLeftRadius: msg.sender === 'me' ? '18px' : '4px',
                                   maxWidth: '75%',
                                   wordBreak: 'break-word',
                                   fontSize: '14px',
                                   lineHeight: '1.4'
                                 }}>
                                   {msg.text && <div>{msg.text}</div>}
                                   {msg.image && <img src={msg.image} alt="Attachment" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: msg.image && !msg.text ? '14px' : '8px', display: 'block', marginTop: msg.text ? '8px' : '0', border: msg.image && !msg.text ? (msg.sender === 'me' ? `2px solid ${accentColor}` : '2px solid #222') : 'none' }} />}
                                 </div>
                                 <span style={{ color: '#888', fontSize: '11px', marginTop: '6px', padding: '0 4px' }}>{msg.time}</span>
                               </div>
                             ))
                           )}
                         </div>

                         {/* Chat Input */}
                         <div style={{ padding: '20px', borderTop: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                           <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                             <input 
                               id="chat-image-upload"
                               type="file" 
                               accept="image/png, image/jpeg, image/gif" 
                               style={{ display: 'none' }} 
                               onChange={handleSendImage}
                             />
                             <button
                               type="button"
                               onClick={() => document.getElementById('chat-image-upload').click()}
                               style={{ background: 'transparent', border: 'none', color: '#857AFF', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                               onMouseEnter={(e) => e.currentTarget.style.color = '#45FFEF'}
                               onMouseLeave={(e) => e.currentTarget.style.color = '#857AFF'}
                               title="Attach Image"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                             </button>
                             <input 
                               type="text" 
                               placeholder="Type a message..." 
                               value={newChatMessage}
                               onChange={(e) => setNewChatMessage(e.target.value)}
                               style={{ flex: 1, backgroundColor: '#111', border: '1px solid #333', borderRadius: '25px', padding: '12px 20px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '14px' }}
                               onFocus={(e) => e.target.style.borderColor = accentColor}
                               onBlur={(e) => e.target.style.borderColor = '#333'}
                             />
                             <button 
                               type="submit"
                               disabled={!newChatMessage.trim()}
                               style={{ backgroundColor: newChatMessage.trim() ? accentColor : '#333', color: newChatMessage.trim() ? 'black' : '#888', border: 'none', borderRadius: '25px', padding: '10px 25px', cursor: newChatMessage.trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', transition: 'all 0.2s', fontSize: '14px' }}
                             >
                               Send
                             </button>
                           </form>
                         </div>
                       </>
                     ) : (
                       <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#666' }}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px', opacity: 0.5 }}>
                           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                         </svg>
                         <p style={{ margin: 0, fontSize: '16px' }}>Select a conversation to start messaging</p>
                       </div>
                     )}
                   </div>
                 )}
              </div>
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

                {/* Privacy & Safety */}
                <div>
                  <h3 style={{ color: '#45FFEF', fontSize: '1.2em', margin: '0 0 20px 0', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Privacy & Safety</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h4 style={{ margin: '0', color: 'white', fontSize: '1.1em' }}>Blocked Users</h4>
                    {blockedUsers.length === 0 ? (
                      <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>You haven't blocked anyone yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {blockedUsers.map(blockedUser => (
                          <div key={blockedUser.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: '10px 15px', borderRadius: '8px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={blockedUser.avatar} alt={blockedUser.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                              <div>
                                <p style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'bold' }}>{blockedUser.name}</p>
                                <p style={{ margin: 0, color: '#857AFF', fontSize: '12px' }}>{blockedUser.handle}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleUnblockUser(blockedUser)}
                              style={{ backgroundColor: 'transparent', color: '#45FFEF', border: '1px solid #45FFEF', padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.target.style.backgroundColor = '#45FFEF'; e.target.style.color = 'black'; }}
                              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#45FFEF'; }}
                            >
                              Unblock
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <h4 style={{ margin: '15px 0 0 0', color: 'white', fontSize: '1.1em' }}>Muted Users</h4>
                    {mutedUsers.length === 0 ? (
                      <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>You haven't muted anyone yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {mutedUsers.map(mutedUser => (
                          <div key={mutedUser.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: '10px 15px', borderRadius: '8px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={mutedUser.avatar} alt={mutedUser.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                              <div>
                                <p style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'bold' }}>{mutedUser.name}</p>
                                <p style={{ margin: 0, color: '#857AFF', fontSize: '12px' }}>{mutedUser.handle}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleUnmuteUser(mutedUser)}
                              style={{ backgroundColor: 'transparent', color: '#FFB800', border: '1px solid #FFB800', padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.target.style.backgroundColor = '#FFB800'; e.target.style.color = 'black'; }}
                              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#FFB800'; }}
                            >
                              Unmute
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                <FooterLink href="/dashboard">Upload Art</FooterLink>
                <FooterLink href="/build-portfolio">Build Portfolio</FooterLink>
            <FooterLink href="/about">Join Community</FooterLink>
              </div>
            </div>

            {/* 3. Talents */}
            <div style={{ flex: '1', minWidth: '150px', marginBottom: isMobile ? '10px' : '20px' }}>
              <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Find Talent</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: isMobile ? 'center' : 'flex-start' }}>
                <FooterLink href="/for-you" category="Illustrations">Illustrations</FooterLink>
                <FooterLink href="/for-you" category="Concept Arts">Concept Arts</FooterLink>
                <FooterLink href="/for-you" category="Animations">Animations</FooterLink>
                <FooterLink href="/for-you" category="Video Edits">Video Edits</FooterLink>
                <FooterLink href="/for-you" category="Graphic Designs">Graphic Designs</FooterLink>
              </div>
            </div>

            {/* 4. About */}
            <div style={{ flex: '1', minWidth: '150px', marginBottom: isMobile ? '10px' : '20px' }}>
              <h4 style={{ color: '#45FFEF', marginBottom: '15px' }}>Mo-Draws</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: isMobile ? 'center' : 'flex-start' }}>
                <FooterLink href="/aboutuspage">About Us</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/guidelines">Guidelines</FooterLink>
                <FooterLink href="/help-centre">Help centre</FooterLink>
                <FooterLink href="/our-team">Our Team</FooterLink>
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
          width: '800px',
              maxHeight: '90vh',
          overflowY: 'auto',
              backgroundColor: '#111',
              border: `2px solid ${accentColor}`,
              borderRadius: '15px',
              padding: '15px',
              boxShadow: `0 10px 40px ${accentColor}40`,
              display: 'flex',
              flexDirection: 'column',
              animation: isClosing ? 'modalContentFadeOut 0.3s ease forwards' : 'modalContentFadeIn 0.3s ease forwards'
            }}
        className="hide-scrollbar"
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
            <div style={{ marginTop: '15px', textAlign: 'left', maxWidth: '600px', width: '100%', margin: '15px auto 0' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#45FFEF', fontSize: '1.5em' }}>{selectedArtwork.title}</h3>
              <p style={{ margin: 0, color: '#857AFF', fontSize: '14px' }}>
                {selectedArtwork.author ? (
                  <span 
                    onClick={() => {
                      setViewingUserProfile(selectedArtwork.author);
                      setSelectedArtwork(null);
                    }}
                    style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
                    onMouseLeave={(e) => e.target.style.color = '#857AFF'}
                  >
                    by {selectedArtwork.author}
                  </span>
                ) : selectedArtwork.date}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '15px', marginTop: '10px', color: '#ccc', fontSize: '14px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {formatCount(selectedArtwork.views)} Views
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  {formatCount(selectedArtwork.likes)} Likes
                </span>
              </div>

          {/* Comments Section */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'left', maxWidth: '600px', width: '100%', margin: '20px auto 0' }}>
            <h4 style={{ color: accentColor, margin: '0 0 15px 0', fontSize: '16px' }}>Comments ({(artworkComments[selectedArtwork.id] || []).reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '15px', paddingRight: '5px' }} className="hide-scrollbar">
              {(artworkComments[selectedArtwork.id] || []).length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', fontStyle: 'italic', margin: '20px 0' }}>No comments yet. Be the first to share your thoughts!</p>
              ) : (
                (artworkComments[selectedArtwork.id] || []).map(c => (
                  <div key={c.id} style={{ marginBottom: '12px' }}>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: replyingToId === c.id ? `1px solid ${accentColor}` : '1px solid #333', transition: 'border-color 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ color: '#FF006B', fontSize: '13px', cursor: 'pointer' }} onClick={() => { setViewingUserProfile(c.author); setSelectedArtwork(null); }}>{c.author}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#888', fontSize: '11px' }}>{c.time}</span>
                        <button onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)} style={{ background: 'transparent', border: 'none', color: '#45FFEF', cursor: 'pointer', padding: '2px', fontSize: '11px', transition: 'color 0.2s' }} title="Reply to comment">Reply</button>
                        {c.author === (user?.name || 'Artist') && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCommentId(c.id);
                                setEditCommentText(c.text);
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#857AFF', cursor: 'pointer', padding: '2px', fontSize: '14px', lineHeight: '1', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onMouseEnter={(e) => e.target.style.color = '#45FFEF'}
                              onMouseLeave={(e) => e.target.style.color = '#857AFF'}
                              title="Edit comment"
                            >
                              ✎
                            </button>
                            <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(selectedArtwork.id, c.id);
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#FF006B', cursor: 'pointer', padding: '2px', fontSize: '16px', lineHeight: '1', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseEnter={(e) => e.target.style.color = '#ff4d94'}
                            onMouseLeave={(e) => e.target.style.color = '#FF006B'}
                            title="Delete comment"
                          >
                            ×
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {editingCommentId === c.id ? (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <input 
                          type="text" 
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#1a1a1a', border: `1px solid ${accentColor}`, borderRadius: '10px', padding: '8px 12px', color: 'white', outline: 'none', fontSize: '14px' }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEditComment(selectedArtwork.id, c.id);
                            } else if (e.key === 'Escape') {
                              setEditingCommentId(null);
                            }
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingCommentId(null)} style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '12px', padding: '4px 8px' }}>Cancel</button>
                          <button onClick={() => handleSaveEditComment(selectedArtwork.id, c.id)} disabled={!editCommentText.trim()} style={{ background: accentColor, border: 'none', color: 'black', cursor: 'pointer', fontSize: '12px', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold', opacity: editCommentText.trim() ? 1 : 0.5 }}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ margin: 0, color: '#e0e0e0', fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word' }}>{c.text}</p>
                    )}
                  </div>

                  {/* Nested Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div style={{ marginLeft: '15px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `2px solid ${accentColor}40`, paddingLeft: '15px' }}>
                      {c.replies.map(reply => (
                        <div key={reply.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <strong style={{ color: '#FF006B', fontSize: '12px', cursor: 'pointer' }} onClick={() => { setViewingUserProfile(reply.author); setSelectedArtwork(null); }}>{reply.author}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ color: '#888', fontSize: '10px' }}>{reply.time}</span>
                              {reply.author === (user?.name || 'Artist') && (
                                <>
                                  <button onClick={(e) => { e.stopPropagation(); setEditingCommentId(reply.id); setEditCommentText(reply.text); }} style={{ background: 'transparent', border: 'none', color: '#857AFF', cursor: 'pointer', padding: '2px', fontSize: '12px' }} title="Edit reply">✎</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteComment(selectedArtwork.id, reply.id, c.id); }} style={{ background: 'transparent', border: 'none', color: '#FF006B', cursor: 'pointer', padding: '2px', fontSize: '14px', lineHeight: '1' }} title="Delete reply">×</button>
                                </>
                              )}
                            </div>
                          </div>
                          {editingCommentId === reply.id ? (
                            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                              <input 
                                type="text" 
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#1a1a1a', border: `1px solid ${accentColor}`, borderRadius: '10px', padding: '6px 10px', color: 'white', outline: 'none', fontSize: '13px' }}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') { e.preventDefault(); handleSaveEditComment(selectedArtwork.id, reply.id, c.id); }
                                  else if (e.key === 'Escape') setEditingCommentId(null);
                                }}
                              />
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setEditingCommentId(null)} style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '11px', padding: '4px 8px' }}>Cancel</button>
                                <button onClick={() => handleSaveEditComment(selectedArtwork.id, reply.id, c.id)} disabled={!editCommentText.trim()} style={{ background: accentColor, border: 'none', color: 'black', cursor: 'pointer', fontSize: '11px', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold' }}>Save</button>
                              </div>
                            </div>
                          ) : (
                            <p style={{ margin: 0, color: '#d0d0d0', fontSize: '13px', lineHeight: '1.4', wordBreak: 'break-word' }}>{reply.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                ))
              )}
            </div>
            {replyingToId && (
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
                <span>Replying to <strong style={{color: '#45FFEF'}}>{(artworkComments[selectedArtwork.id] || []).find(c => c.id === replyingToId)?.author || 'comment'}</strong>...</span>
                <button onClick={() => setReplyingToId(null)} style={{ background: 'none', border: 'none', color: '#FF006B', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>Cancel Reply</button>
              </div>
            )}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Write a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ flex: 1, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '20px', padding: '10px 15px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '14px' }}
                onFocus={(e) => e.target.style.borderColor = accentColor}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                style={{ backgroundColor: newComment.trim() ? accentColor : '#333', color: newComment.trim() ? 'black' : '#888', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: newComment.trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', transition: 'all 0.2s', fontSize: '14px' }}
              >
                Post
              </button>
            </form>
          </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {viewingUserProfile && (
        <div 
          onClick={() => setViewingUserProfile(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            animation: 'backdropFadeIn 0.2s ease forwards'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#111',
              border: `1px solid ${accentColor}`,
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: `0 10px 40px ${accentColor}40`,
              animation: 'modalContentFadeIn 0.2s ease forwards'
            }}
            className="hide-scrollbar"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#222', border: `2px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                    🧑‍🎨
                  </div>
                  {followersList.find(f => f.name === viewingUserProfile)?.isOnline && (
                    <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '16px', height: '16px', backgroundColor: '#00FF66', border: '3px solid #111', borderRadius: '50%' }} title="Online"></div>
                  )}
                </div>
                <div>
                  <h3 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '1.8em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {viewingUserProfile}
                    {mutedUsers.some(u => u.name === viewingUserProfile) && (
                      <span style={{ backgroundColor: 'rgba(255, 184, 0, 0.15)', color: '#FFB800', border: '1px solid #FFB800', fontSize: '12px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Muted</span>
                    )}
                  </h3>
                  <p style={{ color: '#857AFF', margin: '0 0 10px 0', fontSize: '14px' }}>@{viewingUserProfile.toLowerCase().replace(/\s+/g, '')}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => {
                        showToast(`You are now following ${viewingUserProfile}`);
                      }}
                      style={{ backgroundColor: 'transparent', color: accentColor, border: `1px solid ${accentColor}`, padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = accentColor; e.target.style.color = 'black'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = accentColor; }}
                    >
                      Follow
                    </button>
                    <button 
                      onClick={() => handleStartChat(viewingUserProfile)}
                      style={{ backgroundColor: accentColor, color: 'black', border: `1px solid ${accentColor}`, padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = accentColor; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = accentColor; e.target.style.color = 'black'; }}
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingUserProfile(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '28px', lineHeight: '1' }}
                onMouseEnter={(e) => e.target.style.color = '#FF006B'}
                onMouseLeave={(e) => e.target.style.color = '#ccc'}
              >
                ×
              </button>
            </div>
            
            <h4 style={{ color: '#45FFEF', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.2em' }}>Gallery</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
              {[...recommendedArtworks, ...favoriteArtworks]
                .filter(art => art.author === viewingUserProfile)
                .filter((art, index, self) => index === self.findIndex((t) => t.id === art.id)) // Removes any duplicate images
                .map(artwork => (
                  <div 
                    key={`profile-art-${artwork.id}`} 
                    style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #333', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => {
                       handleArtworkClick(artwork);
                       setViewingUserProfile(null);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img src={artwork.thumbnail} alt={artwork.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '12px', backgroundColor: '#1a1a1a' }}>
                      <h5 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artwork.title}</h5>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Unfollow / Block Modal */}
      {userToUnfollow && (
        <div 
          onClick={() => setUserToUnfollow(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            animation: 'backdropFadeIn 0.2s ease forwards'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#111',
              border: '1px solid #333',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              animation: 'modalContentFadeIn 0.2s ease forwards'
            }}
          >
            <img src={userToUnfollow.avatar} alt={userToUnfollow.name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '20px', objectFit: 'cover', border: '2px solid #857AFF' }} />
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '10px' }}>Unfollow {userToUnfollow.name}?</h3>
            <p style={{ color: '#ccc', marginBottom: '30px', fontSize: '14px' }}>Their artworks will no longer appear in your feed.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => {
                  handleToggleFollow(userToUnfollow.id);
                  setUserToUnfollow(null);
                  showToast(`You unfollowed ${userToUnfollow.name}`);
                }}
                style={{ width: '100%', padding: '12px', backgroundColor: '#857AFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6d64cc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#857AFF'}
              >
                Unfollow
              </button>
              <button 
                onClick={() => {
                  if (mutedUsers.some(u => u.id === userToUnfollow.id)) {
                    handleUnmuteUser(userToUnfollow);
                    setUserToUnfollow(null);
                  } else {
                    handleMuteUser(userToUnfollow);
                    showToast(`${userToUnfollow.name} has been muted.`);
                  }
                }}
                style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#FFB800', border: '1px solid #FFB800', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#FFB800'; e.target.style.color = 'black'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#FFB800'; }}
              >
                {mutedUsers.some(u => u.id === userToUnfollow.id) ? 'Unmute User' : 'Mute User'}
              </button>
              <button 
                onClick={() => {
                  if (window.confirm(`Are you sure you want to block ${userToUnfollow.name}? You won't see them in your network anymore.`)) {
                    handleBlockUser(userToUnfollow);
                    showToast(`${userToUnfollow.name} has been blocked.`);
                  }
                }}
                style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#FF006B', border: '1px solid #FF006B', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#FF006B'; e.target.style.color = 'black'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#FF006B'; }}
              >
                Block User
              </button>
              <button 
                onClick={() => setUserToUnfollow(null)}
                style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#ccc', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#333'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ccc'; }}
              >
                Cancel
              </button>
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
