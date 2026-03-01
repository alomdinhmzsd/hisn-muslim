'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from './components/SearchBar';
import BackToTop from './components/BackToTop';
import FavoriteButton from './components/FavoriteButton';
import { Award, Star, RefreshCw, Search } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    fetch('/api/hisn')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error loading TOC:", err));

    // Get favorite count from localStorage
    try {
      const favorites = JSON.parse(localStorage.getItem('hisn_favorites') || '[]');
      setFavoriteCount(favorites.length);
    } catch (e) {
      localStorage.setItem('hisn_favorites', '[]');
      setFavoriteCount(0);
    }
  }, []);

  if (!data) return <div className="loading-state">Loading Hisn Al-Muslim...</div>;

  const chaptersList = data.toc || [];

  // Filter out introduction (0) and merits (999) from main grid
  const mainChapters = chaptersList.filter((chapter: any) =>
    chapter.chapter_id !== 0 && chapter.chapter_id !== 999
  );

  // Get favorite IDs from localStorage
  let favoriteIds: string[] = [];
  try {
    favoriteIds = JSON.parse(localStorage.getItem('hisn_favorites') || '[]');
  } catch (e) {
    favoriteIds = [];
  }

  // Filter chapters
  let filteredTOC = mainChapters.filter((chapter: any) => {
    const matchesSearch =
      chapter.title_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.title_ar?.includes(searchQuery) ||
      chapter.chapter_id.toString().includes(searchQuery);

    if (showFavorites) {
      return matchesSearch && favoriteIds.includes(String(chapter.chapter_id));
    }
    return matchesSearch;
  });

  // Reset favorites function
  const resetFavorites = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      localStorage.setItem('hisn_favorites', '[]');
      setFavoriteCount(0);
      if (showFavorites) {
        setShowFavorites(false);
      }
    }
  };

  return (
    <main>
      {/* HERO SECTION - Clean and simple */}
      <div className="hero-section">
        <h1 className="hero-title-ar">حصن المسلم</h1>
        <h2 className="hero-subtitle">Hisn Al-Muslim</h2>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-sunken">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search 132 chapters..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ACTION CARDS */}
        <div className="nav-tool-row">
          <Link href="/dua/introduction" className="nav-card">
            Introduction
          </Link>

          <Link href="/dua/merits" className="nav-card">
            <Award size={18} />
            <span>Merits</span>
          </Link>

          {/* Favorites Filter Button */}
          <button
            className={`nav-card ${showFavorites ? 'active-filter' : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Star
              size={18}
              fill={showFavorites ? "#ffca28" : "none"}
              color={showFavorites ? "#ffca28" : "#94a3b8"}
            />
            <span>Favorites ({favoriteCount})</span>
          </button>

          {/* Reset Favorites Button (Icon only) */}
          {favoriteCount > 0 && (
            <button
              className="nav-card reset-btn"
              onClick={resetFavorites}
              title="Reset All Favorites"
            >
              <RefreshCw size={18} />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT - Simplified */}
      <div className="container">
        {/* Show message when no favorites */}
        {showFavorites && filteredTOC.length === 0 && (
          <div className="no-favorites-message">
            <Star size={32} style={{ marginBottom: '15px', opacity: 0.5 }} />
            <h3>No favorite chapters yet</h3>
            <p>Click the star icon on any chapter card to add it to favorites.</p>
          </div>
        )}

            {/* GRID LAYOUT - Fixed links */}
            <div className="toc-grid">
              {filteredTOC.map((chapter: any) => (
                <div key={chapter.chapter_id} className="chapter-card-wrapper">
                  <Link href={`/dua/${chapter.chapter_id}`} className="toc-item-card">
                    <div className="toc-content">
                      <h3 className="toc-ar">{chapter.title_ar}</h3>
                      <h4 className="toc-en">
                        {chapter.title_en?.replace(/^Chapter:\s*/i, '')}
                      </h4>
                    </div>

                    {/* BOTTOM ROW - Only one set of elements */}
                    <div className="card-bottom-row">
                      <FavoriteButton
                        chapterId={String(chapter.chapter_id)}
                        onToggle={() => {
                          const favorites = JSON.parse(localStorage.getItem('hisn_favorites') || '[]');
                          setFavoriteCount(favorites.length);
                        }}
                      />

                      {/* ONLY ONE .dua-count element */}
                      <span className="dua-count">
                        {chapter.dua_count || 0} Duas
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
      </div>

      <BackToTop />
    </main>
  );
}