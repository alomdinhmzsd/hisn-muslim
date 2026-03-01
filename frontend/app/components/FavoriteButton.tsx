// FavoriteButton.tsx - ADD THIS after toggling favorites
'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  chapterId: string;
  onToggle?: () => void;
}

export default function FavoriteButton({ chapterId, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('hisn_favorites') || '[]');
      setIsFavorite(favorites.includes(chapterId));
    } catch (e) {
      localStorage.setItem('hisn_favorites', '[]');
      setIsFavorite(false);
    }
  }, [chapterId]);

  const toggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('hisn_favorites') || '[]');
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter((id: string) => id !== chapterId);
      } else {
        newFavorites = [...favorites, chapterId];
      }

      localStorage.setItem('hisn_favorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);

      // CRITICAL: Dispatch event to update all components
      window.dispatchEvent(new CustomEvent('favorites-updated'));

      if (onToggle) onToggle();
    } catch (e) {
      console.error("Error toggling favorite:", e);
    }
  };

  return (
    <button
      className={`fav-btn-bottom ${isFavorite ? 'active' : ''}`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        size={20}
        fill={isFavorite ? "#ffca28" : "none"}
        color={isFavorite ? "#ffca28" : "#94a3b8"}
      />
    </button>
  );
}