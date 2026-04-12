import React, { useEffect, useRef, useState } from 'react';

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

const getPortfolioItemsFromDb = async () => {
  const db = await openPortfolioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PORTFOLIO_STORE_NAME, 'readonly');
    const store = tx.objectStore(PORTFOLIO_STORE_NAME);
    const request = store.get(PORTFOLIO_RECORD_KEY);

    request.onsuccess = () => {
      resolve(Array.isArray(request.result) ? request.result : []);
    };
    request.onerror = () => reject(request.error);
  });
};

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

const steps = [
  {
    title: 'Define Your Focus',
    description: 'Choose 2-3 art categories you want to be known for and keep your gallery cohesive.'
  },
  {
    title: 'Curate Your Best Work',
    description: 'Select quality over quantity. Lead with your strongest pieces and remove outdated work.'
  },
  {
    title: 'Tell The Story',
    description: 'Add short context for each piece: tools used, goals, and creative process.'
  },
  {
    title: 'Keep It Fresh',
    description: 'Update your portfolio monthly with recent projects and progress shots.'
  }
];

const BuildPortfolioPage = () => {
  const [isSharedView, setIsSharedView] = useState(() => new URLSearchParams(window.location.search).has('share'));
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [entryType, setEntryType] = useState('artwork');
  const [artworkLayout, setArtworkLayout] = useState('single');
  const [shareNotice, setShareNotice] = useState('');
  const [saveWarning, setSaveWarning] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [textHeadingLevel, setTextHeadingLevel] = useState('h2');
  const [textVerticalAlign, setTextVerticalAlign] = useState('center');
  const [imageDataList, setImageDataList] = useState([]);
  const [imageNames, setImageNames] = useState([]);
  const fileInputRef = useRef(null);
  const [shareCode] = useState(() => {
    const existing = localStorage.getItem('portfolioShareCode');
    if (existing) return existing;
    const generated = `md-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('portfolioShareCode', generated);
    return generated;
  });
  const [portfolioItems, setPortfolioItems] = useState(() => {
    const saved = localStorage.getItem('portfolioItems');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [portfolioView, setPortfolioView] = useState(() => localStorage.getItem('portfolioView') || 'landscape');
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [bookIndex, setBookIndex] = useState(0);
  const [isPageFlipping, setIsPageFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [flipPageItem, setFlipPageItem] = useState(null);
  const [flipAngle, setFlipAngle] = useState(0);
  const [openInstructionIndex, setOpenInstructionIndex] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const syncShareModeFromUrl = () => {
      setIsSharedView(new URLSearchParams(window.location.search).has('share'));
    };

    window.addEventListener('popstate', syncShareModeFromUrl);
    return () => window.removeEventListener('popstate', syncShareModeFromUrl);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadPortfolioItems = async () => {
      try {
        const dbItems = await getPortfolioItemsFromDb();
        const savedItems = (() => {
          try {
            return JSON.parse(localStorage.getItem('portfolioItems') || '[]');
          } catch {
            return [];
          }
        })();

        if (!isCancelled) {
          const mergedItems = [...dbItems, ...savedItems].reduce((acc, item) => {
            if (!acc.some(existing => existing.id === item.id)) {
              acc.push(item);
            }
            return acc;
          }, []);

          if (mergedItems.length > 0) {
            setPortfolioItems(mergedItems);
          }
          setSaveWarning('');
        }
      } catch (error) {
        if (!isCancelled) {
          setSaveWarning('Could not access full portfolio storage. Limited browser storage is in use.');
        }
        console.error('Failed to load portfolio items from IndexedDB:', error);
      } finally {
        if (!isCancelled) {
          setPortfolioLoaded(true);
        }
      }
    };

    loadPortfolioItems();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!portfolioLoaded) return;

    const savePortfolioItems = async () => {
      try {
        await savePortfolioItemsToDb(portfolioItems);
        localStorage.removeItem('portfolioItems');
        localStorage.setItem('portfolioItemsMeta', JSON.stringify({
          count: portfolioItems.length,
          updatedAt: Date.now()
        }));
        setSaveWarning('');
      } catch (error) {
        setSaveWarning('Could not save portfolio changes in this browser session.');
        console.error('Failed to save portfolio items to IndexedDB:', error);
      }
    };

    savePortfolioItems();
  }, [portfolioItems, portfolioLoaded]);

  useEffect(() => {
    localStorage.setItem('portfolioView', portfolioView);
  }, [portfolioView]);

  useEffect(() => {
    if (portfolioItems.length === 0) {
      setBookIndex(0);
      return;
    }
    if (bookIndex > portfolioItems.length - 1) {
      setBookIndex(portfolioItems.length - 1);
    }
  }, [portfolioItems, bookIndex]);

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const shareLink = `${window.location.origin}/build-portfolio?share=${shareCode}`;

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareNotice('Share link copied');
    } catch (error) {
      setShareNotice('Could not copy automatically. Please copy manually.');
      console.error('Failed to copy share link:', error);
    }

    setTimeout(() => setShareNotice(''), 2400);
  };

  const normalizeUrl = (url) => {
    const value = (url || '').trim();
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `https://${value}`;
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description.');
      return;
    }

    if (entryType === 'artwork' && imageDataList.length === 0) {
      alert('Please upload image(s) for artwork entries.');
      return;
    }

    const itemId = editingItemId || Date.now();
    const normalizedLink = normalizeUrl(referenceLink);

    const newItem = {
      id: itemId,
      type: entryType,
      layout: entryType === 'artwork' ? artworkLayout : 'single',
      headingLevel: entryType === 'text' ? textHeadingLevel : 'h2',
      textAlignVertical: entryType === 'text' ? textVerticalAlign : 'center',
      title: title.trim(),
      description: description.trim(),
      referenceLink: entryType === 'artwork' ? normalizedLink : '',
      imageUrl: entryType === 'artwork' ? imageDataList[0] : '',
      imageUrls: entryType === 'artwork' ? imageDataList : []
    };

    if (editingItemId) {
      setPortfolioItems((prev) => prev.map((item) => (item.id === editingItemId ? newItem : item)));
    } else {
      setPortfolioItems((prev) => [newItem, ...prev]);
    }

    setTitle('');
    setDescription('');
    setReferenceLink('');
    setTextHeadingLevel('h2');
    setTextVerticalAlign('center');
    setImageDataList([]);
    setImageNames([]);
    setEditingItemId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setEntryType(item.type || 'text');
    setArtworkLayout(item.layout || 'single');
    setTextHeadingLevel(item.headingLevel || 'h2');
    setTextVerticalAlign(item.textAlignVertical || 'center');
    setTitle(item.title || '');
    setDescription(item.description || '');
    setReferenceLink((item.type || 'text') === 'artwork' ? (item.referenceLink || '') : '');

    if ((item.type || 'text') === 'artwork') {
      const existingImages = Array.isArray(item.imageUrls) && item.imageUrls.length > 0
        ? item.imageUrls
        : (item.imageUrl ? [item.imageUrl] : []);
      setImageDataList(existingImages);
      setImageNames(existingImages.map((_, idx) => `image-${idx + 1}`));
    } else {
      setImageDataList([]);
      setImageNames([]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEntryType('artwork');
    setArtworkLayout('single');
    setTitle('');
    setDescription('');
    setReferenceLink('');
    setTextHeadingLevel('h2');
    setTextVerticalAlign('center');
    setImageDataList([]);
    setImageNames([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const nonImage = files.find((file) => !file.type.startsWith('image/'));
    if (nonImage) {
      alert('Please select image files only.');
      e.target.value = '';
      return;
    }

    const selectedFiles = artworkLayout === 'grid' ? files.slice(0, 9) : [files[0]];

    const compressImage = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const maxDimension = 1400;
            const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
            const targetWidth = Math.max(1, Math.round(img.width * scale));
            const targetHeight = Math.max(1, Math.round(img.height * scale));

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(reader.result || '');
              return;
            }

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            resolve(canvas.toDataURL('image/jpeg', 0.75));
          };
          img.onerror = () => resolve(reader.result || '');
          img.src = reader.result;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

    Promise.all(
      selectedFiles.map(
        (file) => compressImage(file)
      )
    ).then((results) => {
      setImageDataList(results.filter(Boolean));
      setImageNames(selectedFiles.map((file) => file.name));
    });
  };

  const handleRemoveSelectedImage = (indexToRemove) => {
    setImageDataList((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImageNames((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearSelectedImages = () => {
    setImageDataList([]);
    setImageNames([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteItem = (id) => {
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemDragStart = (id) => {
    setDraggedItemId(id);
  };

  const handleItemDragOver = (e) => {
    e.preventDefault();
  };

  const handleItemDrop = (targetId) => {
    if (!draggedItemId || draggedItemId === targetId) return;
    setPortfolioItems((prev) => {
      const draggedIndex = prev.findIndex((item) => item.id === draggedItemId);
      const targetIndex = prev.findIndex((item) => item.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      const reordered = [...prev];
      const [dragged] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, dragged);
      return reordered;
    });
    setDraggedItemId(null);
  };

  const goToBookPage = (direction) => {
    if (isPageFlipping || portfolioItems.length === 0) return;
    const nextIndex = direction === 'next'
      ? Math.min(bookIndex + 1, portfolioItems.length - 1)
      : Math.max(bookIndex - 1, 0);

    if (nextIndex === bookIndex) return;

    setFlipDirection(direction);
    setFlipPageItem(portfolioItems[bookIndex]);
    setFlipAngle(0);
    setIsPageFlipping(true);

    // Kick off animation on next frame so the browser can interpolate from 0deg.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlipAngle(direction === 'next' ? -168 : 168);
      });
    });

    setTimeout(() => {
      setBookIndex(nextIndex);
    }, 360);
    setTimeout(() => {
      setIsPageFlipping(false);
      setFlipPageItem(null);
      setFlipAngle(0);
    }, 760);
  };

  const renderArtworkPreview = (item) => {
    const artworkImages = Array.isArray(item.imageUrls) && item.imageUrls.length > 0
      ? item.imageUrls
      : (item.imageUrl ? [item.imageUrl] : []);

    if (artworkImages.length === 0) return null;

    if ((item.layout === 'grid' || artworkImages.length > 1) && artworkImages.length > 1) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '12px' }}>
          {artworkImages.map((src, index) => (
            <img
              key={`${item.id}-img-${index}`}
              src={src}
              alt={`${item.title} ${index + 1}`}
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', backgroundColor: '#1a1a1a' }}
            />
          ))}
        </div>
      );
    }

    return (
      <img
        src={artworkImages[0]}
        alt={item.title}
        style={{ width: '100%', maxHeight: '320px', height: 'auto', objectFit: 'contain', borderRadius: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a' }}
      />
    );
  };

  const renderBookPageContent = (item) => {
    if (!item) {
      return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          Empty page
        </div>
      );
    }

    const HeadingTag = item.type === 'text' ? (item.headingLevel || 'h2') : 'h4';
    const textJustify = item.textAlignVertical === 'top'
      ? 'flex-start'
      : item.textAlignVertical === 'bottom'
        ? 'flex-end'
        : 'center';

    return (
      <article>
        {item.type === 'artwork' && renderArtworkPreview(item)}
        <p style={{ margin: '0 0 6px 0', color: '#857AFF', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.type}</p>
        {item.type === 'text' ? (
          <div style={{ minHeight: '230px', display: 'flex', flexDirection: 'column', justifyContent: textJustify }}>
            <HeadingTag style={{ margin: '0 0 8px 0', color: 'white' }}>{item.title}</HeadingTag>
            <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{item.description}</p>
          </div>
        ) : (
          <>
            <h4 style={{ margin: '0 0 8px 0', color: 'white' }}>{item.title}</h4>
            <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{item.description}</p>
          </>
        )}
        {item.type === 'artwork' && item.referenceLink && (
          <a
            href={item.referenceLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '10px', color: '#45FFEF', textDecoration: 'underline', fontSize: '13px', fontWeight: 'bold' }}
          >
            Visit Link
          </a>
        )}
      </article>
    );
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
          onClick={() => navigateTo(isSharedView ? '/' : '/dashboard')}
          style={{
            border: '1px solid #45FFEF',
            color: '#45FFEF',
            backgroundColor: 'transparent',
            padding: '10px 18px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isSharedView ? 'Back to Home' : 'Back to Dashboard'}
        </button>
      </header>

      <main style={{ flex: 1, maxWidth: '980px', width: '100%', margin: '0 auto', padding: isMobile ? '36px 18px' : '56px 30px' }}>
        <h2 style={{ margin: '0 0 12px 0', color: '#FF006B', fontSize: isMobile ? '2.1em' : '3em' }}>Build Your Portfolio</h2>
        <p style={{ margin: '0 0 24px 0', color: '#ccc', lineHeight: 1.7 }}>
          A strong portfolio helps you stand out. Use this quick framework to present your best work with clarity.
        </p>

        {!isSharedView && (
          <section style={{ marginBottom: '18px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: isMobile ? '14px' : '18px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#45FFEF', fontSize: '1em' }}>Share Your Portfolio</h3>
            <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '13px' }}>
              Your special share link is generated automatically.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: '10px' }}>
              <input
                type="text"
                value={shareLink}
                readOnly
                style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', borderRadius: '8px', padding: '10px' }}
              />
              <button
                type="button"
                onClick={handleCopyShareLink}
                style={{ border: '1px solid #857AFF', color: '#857AFF', backgroundColor: 'transparent', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Copy Link
              </button>
            </div>
            {shareNotice && (
              <p style={{ margin: '8px 0 0 0', color: '#45FFEF', fontSize: '13px' }}>{shareNotice}</p>
            )}
            {saveWarning && (
              <p style={{ margin: '8px 0 0 0', color: '#FFB800', fontSize: '13px' }}>{saveWarning}</p>
            )}
          </section>
        )}

        {!isSharedView && (
          <section ref={formRef} style={{ marginBottom: '28px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: isMobile ? '16px' : '22px' }}>
            <h3 style={{ margin: '0 0 14px 0', color: '#45FFEF' }}>{editingItemId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h3>
          <form onSubmit={handleAddItem} style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setEntryType('artwork')}
                  style={{
                    flex: 1,
                    backgroundColor: entryType === 'artwork' ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                    color: entryType === 'artwork' ? '#45FFEF' : '#ccc',
                    border: entryType === 'artwork' ? '1px solid #857AFF' : '1px solid #333',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Artwork
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('text')}
                  style={{
                    flex: 1,
                    backgroundColor: entryType === 'text' ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                    color: entryType === 'text' ? '#45FFEF' : '#ccc',
                    border: entryType === 'text' ? '1px solid #857AFF' : '1px solid #333',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Text
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', borderRadius: '8px', padding: '10px' }}
              />
            </div>

            {entryType === 'artwork' && (
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setArtworkLayout('single');
                      setImageDataList((prev) => (prev.length > 0 ? [prev[0]] : []));
                      setImageNames((prev) => (prev.length > 0 ? [prev[0]] : []));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: artworkLayout === 'single' ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                      color: artworkLayout === 'single' ? '#45FFEF' : '#ccc',
                      border: artworkLayout === 'single' ? '1px solid #857AFF' : '1px solid #333',
                      borderRadius: '8px',
                      padding: '10px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Single
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setArtworkLayout('grid');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: artworkLayout === 'grid' ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                      color: artworkLayout === 'grid' ? '#45FFEF' : '#ccc',
                      border: artworkLayout === 'grid' ? '1px solid #857AFF' : '1px solid #333',
                      borderRadius: '8px',
                      padding: '10px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Grid
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple={artworkLayout === 'grid'}
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{ border: '1px solid #857AFF', color: '#857AFF', backgroundColor: 'transparent', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {artworkLayout === 'grid' ? 'Add Images From Gallery' : 'Add From Gallery'}
                  </button>
                  <span style={{ color: imageNames.length > 0 ? '#45FFEF' : '#aaa', fontSize: '13px' }}>
                    {imageNames.length > 0
                      ? `${imageNames.length} selected: ${imageNames.join(', ')}`
                      : 'No image selected'}
                  </span>
                  {imageDataList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSelectedImages}
                      style={{ border: '1px solid #FF006B', color: '#FF006B', backgroundColor: 'transparent', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                    >
                      Clear selected
                    </button>
                  )}
                </div>
                {imageDataList.length > 0 && (
                  artworkLayout === 'grid' && imageDataList.length > 1 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                      {imageDataList.map((src, index) => (
                        <div key={`preview-${index}`} style={{ position: 'relative' }}>
                          <img
                            src={src}
                            alt={`Selected artwork preview ${index + 1}`}
                            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#1a1a1a' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedImage(index)}
                            style={{ position: 'absolute', top: '6px', right: '6px', border: '1px solid #FF006B', color: '#FF006B', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '10px', padding: '2px 7px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}
                            title="Remove image"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={imageDataList[0]}
                        alt="Selected artwork preview"
                        style={{ width: '100%', maxHeight: '220px', height: 'auto', objectFit: 'contain', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#1a1a1a' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedImage(0)}
                        style={{ position: 'absolute', top: '8px', right: '8px', border: '1px solid #FF006B', color: '#FF006B', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '10px', padding: '2px 7px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}
                        title="Remove image"
                      >
                        x
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this piece"
              rows={4}
              style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', borderRadius: '8px', padding: '10px', resize: 'vertical' }}
            />

            {entryType === 'text' && (
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['h1', 'h2', 'h3', 'h4'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setTextHeadingLevel(level)}
                        style={{
                          flex: 1,
                          backgroundColor: textHeadingLevel === level ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                          color: textHeadingLevel === level ? '#45FFEF' : '#ccc',
                          border: textHeadingLevel === level ? '1px solid #857AFF' : '1px solid #333',
                          borderRadius: '8px',
                          padding: '9px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['top', 'center', 'bottom'].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setTextVerticalAlign(pos)}
                        style={{
                          flex: 1,
                          backgroundColor: textVerticalAlign === pos ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                          color: textVerticalAlign === pos ? '#45FFEF' : '#ccc',
                          border: textVerticalAlign === pos ? '1px solid #857AFF' : '1px solid #333',
                          borderRadius: '8px',
                          padding: '9px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {entryType === 'artwork' && (
              <input
                type="text"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                placeholder="Optional link for viewers to visit (e.g. your website)"
                style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #333', borderRadius: '8px', padding: '10px' }}
              />
            )}

            <div>
              <button
                type="submit"
                style={{ border: '1px solid #45FFEF', color: '#45FFEF', backgroundColor: 'transparent', padding: '10px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {editingItemId ? 'Save Changes' : 'Add to Portfolio'}
              </button>
              {editingItemId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{ marginLeft: '10px', border: '1px solid #555', color: '#ccc', backgroundColor: 'transparent', padding: '10px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          </section>
        )}

        {!isSharedView && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {steps.map((step, index) => {
              const isOpen = openInstructionIndex === index;
              return (
                <article key={step.title} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setOpenInstructionIndex(isOpen ? null : index)}
                    style={{ width: '100%', background: 'transparent', border: 'none', padding: isMobile ? '14px 16px' : '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#857AFF', color: 'black', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                        {index + 1}
                      </span>
                      <span style={{ color: '#45FFEF', fontSize: '1.05em', fontWeight: 'bold', textAlign: 'left' }}>{step.title}</span>
                    </span>
                    <span style={{ color: '#ccc', fontSize: '18px', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: isMobile ? '0 16px 14px 16px' : '0 20px 16px 20px' }}>
                      <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{step.description}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <section style={{ marginTop: '28px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#45FFEF' }}>Your Portfolio Items</h3>
          {portfolioItems.length === 0 ? (
            <p style={{ margin: 0, color: '#aaa' }}>No items yet. Add an artwork piece or text piece above.</p>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setPortfolioView('landscape')}
                  style={{
                    backgroundColor: portfolioView === 'landscape' ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                    color: portfolioView === 'landscape' ? '#45FFEF' : '#ccc',
                    border: portfolioView === 'landscape' ? '1px solid #857AFF' : '1px solid #333',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Landscape
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioView('book')}
                  style={{
                    backgroundColor: portfolioView === 'book' ? 'rgba(133, 122, 255, 0.2)' : '#1a1a1a',
                    color: portfolioView === 'book' ? '#45FFEF' : '#ccc',
                    border: portfolioView === 'book' ? '1px solid #857AFF' : '1px solid #333',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Book
                </button>
              </div>

              {!isSharedView && (
                <div style={{ marginBottom: '14px', padding: '12px', borderRadius: '10px', border: '1px dashed #333', backgroundColor: '#101010' }}>
                <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '13px' }}>Drag and drop to reorder your uploaded pieces.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                  {portfolioItems.map((item, index) => (
                    <div
                      key={`order-${item.id}`}
                      draggable
                      onDragStart={() => handleItemDragStart(item.id)}
                      onDragOver={handleItemDragOver}
                      onDrop={() => handleItemDrop(item.id)}
                      style={{ border: '1px solid #333', borderRadius: '8px', padding: '10px', backgroundColor: '#151515', cursor: 'move' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <p style={{ margin: 0, color: '#857AFF', fontSize: '11px', fontWeight: 'bold' }}>#{index + 1}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleEditItem(item)}
                            style={{ border: '1px solid #857AFF', color: '#857AFF', background: 'transparent', borderRadius: '10px', padding: '2px 7px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}
                            title="Edit this upload"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            style={{ border: '1px solid #FF006B', color: '#FF006B', background: 'transparent', borderRadius: '10px', padding: '2px 7px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}
                            title="Remove this upload"
                          >
                            x
                          </button>
                        </div>
                      </div>
                      <p style={{ margin: 0, color: 'white', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                    </div>
                  ))}
                </div>
                </div>
              )}

              {portfolioView === 'book' ? (
                <div style={{ border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#0f0f0f' }}>
                  <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: isMobile ? '380px' : '460px', perspective: '1600px' }}>
                    <div style={{ padding: '16px', borderRight: '1px solid #222', background: 'linear-gradient(90deg, #121212 0%, #101010 100%)' }}>
                      {renderBookPageContent(bookIndex > 0 ? portfolioItems[bookIndex - 1] : null)}
                    </div>
                    <div style={{ padding: '16px', background: 'linear-gradient(270deg, #121212 0%, #101010 100%)' }}>
                      {renderBookPageContent(portfolioItems[bookIndex] || null)}
                    </div>

                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: '#1f1f1f', boxShadow: '0 0 10px rgba(0,0,0,0.6)' }} />

                    {isPageFlipping && flipPageItem && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          width: '50%',
                          left: flipDirection === 'next' ? '50%' : 0,
                          padding: '16px',
                          background: 'linear-gradient(270deg, #1a1a1a 0%, #111 100%)',
                          borderLeft: flipDirection === 'next' ? '1px solid #222' : 'none',
                          borderRight: flipDirection === 'prev' ? '1px solid #222' : 'none',
                          transformStyle: 'preserve-3d',
                          transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                          transform: `rotateY(${flipAngle}deg)`,
                          transition: 'transform 0.72s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.72s cubic-bezier(0.22, 0.61, 0.36, 1)',
                          boxShadow: flipDirection === 'next' ? '-24px 0 40px rgba(0,0,0,0.55)' : '24px 0 40px rgba(0,0,0,0.55)',
                          pointerEvents: 'none'
                        }}
                      >
                        {renderBookPageContent(flipPageItem)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', padding: '10px 16px' }}>
                    <button
                      type="button"
                      onClick={() => goToBookPage('prev')}
                      disabled={bookIndex === 0}
                      style={{ border: '1px solid #333', color: bookIndex === 0 ? '#666' : '#45FFEF', backgroundColor: 'transparent', borderRadius: '8px', padding: '8px 12px', cursor: bookIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                      Previous
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#aaa', fontSize: '13px' }}>Page {Math.min(bookIndex + 1, portfolioItems.length)} / {portfolioItems.length}</span>
                      {portfolioItems[bookIndex] && (
                        <>
                          {!isSharedView && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEditItem(portfolioItems[bookIndex])}
                                style={{ border: '1px solid #857AFF', color: '#857AFF', background: 'transparent', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(portfolioItems[bookIndex].id)}
                                style={{ border: '1px solid #FF006B', color: '#FF006B', background: 'transparent', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => goToBookPage('next')}
                      disabled={bookIndex >= portfolioItems.length - 1}
                      style={{ border: '1px solid #333', color: bookIndex >= portfolioItems.length - 1 ? '#666' : '#45FFEF', backgroundColor: 'transparent', borderRadius: '8px', padding: '8px 12px', cursor: bookIndex >= portfolioItems.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    columnCount: isMobile ? 1 : 2,
                    columnGap: '14px'
                  }}
                >
                  {portfolioItems.map((item) => (
                    <article
                      key={item.id}
                      draggable
                      onDragStart={() => handleItemDragStart(item.id)}
                      onDragOver={handleItemDragOver}
                      onDrop={() => handleItemDrop(item.id)}
                      style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '16px', cursor: 'move', breakInside: 'avoid', marginBottom: '14px', display: 'inline-block', width: '100%' }}
                    >
                      {item.type === 'artwork' && renderArtworkPreview(item)}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: '0 0 6px 0', color: '#857AFF', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.type}</p>
                          {item.type === 'text' ? (
                            (() => {
                              const TextHeadingTag = item.headingLevel || 'h2';
                              const textJustify = item.textAlignVertical === 'top'
                                ? 'flex-start'
                                : item.textAlignVertical === 'bottom'
                                  ? 'flex-end'
                                  : 'center';

                              return (
                                <div style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: textJustify }}>
                                  <TextHeadingTag style={{ margin: '0 0 8px 0', color: 'white' }}>{item.title}</TextHeadingTag>
                                  <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{item.description}</p>
                                </div>
                              );
                            })()
                          ) : (
                            <>
                              <h4 style={{ margin: '0 0 8px 0', color: 'white' }}>{item.title}</h4>
                              <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{item.description}</p>
                            </>
                          )}
                          {item.type === 'artwork' && item.referenceLink && (
                            <a
                              href={item.referenceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-block', marginTop: '10px', color: '#45FFEF', textDecoration: 'underline', fontSize: '13px', fontWeight: 'bold' }}
                            >
                              Visit Link
                            </a>
                          )}
                        </div>
                        {!isSharedView && (
                          <>
                            <button
                              onClick={() => handleEditItem(item)}
                              style={{ border: '1px solid #857AFF', color: '#857AFF', background: 'transparent', borderRadius: '18px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', flexShrink: 0 }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              style={{ border: '1px solid #FF006B', color: '#FF006B', background: 'transparent', borderRadius: '18px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', flexShrink: 0 }}
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default BuildPortfolioPage;
