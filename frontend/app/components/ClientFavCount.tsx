// app/components/ClientFavCount.tsx
'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function ClientFavCount() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('hisn_favorites') || '[]');
        setFavCount(Array.isArray(favs) ? favs.length : 0);
      } catch (e) {
        setFavCount(0);
      }
    };

    updateCount();
    window.addEventListener('favorites-updated', updateCount);

    return () => {
      window.removeEventListener('favorites-updated', updateCount);
    };
  }, []);

  return (
    <div className="favorites-display">
      <Star
        size={20}
        fill={favCount > 0 ? "#8bc34a" : "none"}
        color="#8bc34a"
      />
      <span className="favorites-count">
        {favCount} Favorites
      </span>
    </div>
  );
}