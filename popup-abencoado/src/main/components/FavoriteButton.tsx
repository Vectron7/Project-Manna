'use client';

import { useState } from 'react';
import styles from './popup.module.css';

interface FavoriteButtonProps {
  userId: string;
  verseId: string;
}

export function FavoriteButton({ userId, verseId }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading || !userId) return;

    setIsLoading(true);
    const prevState = isFavorited;
    setIsFavorited(!prevState);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verseId, origin: 'popup' }),
      });

      const result = await response.json();
      if (!result.success) throw new Error();
      
      setIsFavorited(result.data.action === 'added');
    } catch {
      setIsFavorited(prevState);
      console.error("Erro ao favoritar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`${styles.btnFavorite} ${isFavorited ? styles.active : ''}`} 
      onClick={handleToggle}
      disabled={isLoading}
      style={{ opacity: isLoading ? 0.7 : 1, border: 'none', background: 'none', cursor: 'pointer' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/assets/Icones SVG/Icone.Coracao.svg" 
        className={styles.favoriteIcon} 
        alt="Favoritar"
        style={{ 
          filter: isFavorited ? 'invert(27%) sepia(91%) saturate(2352%) hue-rotate(331%) brightness(94%) contrast(94%)' : 'none',
          transition: 'all 0.2s ease'
        }} 
      />
    </button>
  );
}