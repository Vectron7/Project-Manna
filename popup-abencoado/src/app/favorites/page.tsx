'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './favorites.module.css';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/main/components/Sidebar';

interface FavoriteResponse {
  verse_id: string;
  versiculos: {
    id: string;
    texto: string;
    referencia: string;
  } | null;
}

interface FavoriteVerse {
  id: string;
  texto: string;
  ref: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const STATIC_USER_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    async function loadFavorites() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            verse_id,
            versiculos (id, texto, referencia)
          `)
          .eq('user_id', STATIC_USER_ID);

        if (error) throw error;

        if (data) {
          const formatted = (data as unknown as FavoriteResponse[])
            .filter(f => f.versiculos !== null)
            .map((f) => ({
              id: f.versiculos!.id,
              texto: f.versiculos!.texto,
              ref: f.versiculos!.referencia
            }));
          
          setFavorites(formatted);
        }
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  const nextFavorite = () => {
    if (favorites.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % favorites.length);
  };

  const prevFavorite = () => {
    if (favorites.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + favorites.length) % favorites.length);
  };

  return (
    <div className={styles.mainWrapper}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Calligraffitti&display=swap');
      `}</style>

      <div className={styles.backgroundContainer}>
        <Image
          src="/assets/Logo e Wallpapers/Wallpaper.Cristo.png"
          alt="Background"
          fill
          priority
          className={styles.backgroundImage}
        />
      </div>

      <Sidebar />

      <main className={styles.contentOverlay}>
        {isLoading ? (
          <div className={styles.statusMsg}>Carregando...</div>
        ) : favorites.length === 0 ? (
          <div className={styles.statusMsg}>Nenhum favorito encontrado.</div>
        ) : (
          <div className={styles.viewerContainer}>
            <button className={styles.navButton} onClick={prevFavorite}>❮</button>

            <div className={styles.paperWrapper}>
              <div className={styles.paperImageContainer}>
                <Image 
                  src="/assets/Itens Recortados/FolhasdePapel07.png" 
                  alt="Papel" 
                  fill
                  className={styles.paperImage}
                  priority
                />
              </div>
              <div className={styles.textContainer}>
                <p className={styles.verseText}>
                  &ldquo;{favorites[currentIndex].texto}&rdquo;
                </p>
                <span className={styles.verseRef}>
                  — {favorites[currentIndex].ref}
                </span>
              </div>
            </div>

            <button className={styles.navButton} onClick={nextFavorite}>❯</button>
          </div>
        )}
      </main>
    </div>
  );
}