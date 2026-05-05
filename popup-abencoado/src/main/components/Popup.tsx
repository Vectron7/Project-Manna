'use client';

import React, { useState, useCallback, useSyncExternalStore } from 'react';
import { getOrSetUserId } from '../utils/userPersistence';
import styles from './popup.module.css';

const feelings = [
  { id: 'seguranca', label: 'Inseguro', type: 'outline' },
  { id: 'feliz', label: 'Feliz', type: 'solid' },
  { id: 'caminho', label: 'Perdido', type: 'outline' },
  { id: 'paz', label: 'Em Paz', type: 'solid' },
  { id: 'descanso', label: 'Cansado', type: 'outline' },
  { id: 'gratidao', label: 'Grato', type: 'outline' }
];

const getRandomFeeling = () => {
  const fallback = ['seguranca', 'caminho', 'descanso'];
  return fallback[Math.floor(Math.random() * fallback.length)];
};

function useIsClient() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export default function Popup() {
  const isClient = useIsClient();
  const [dismissed, setDismissed] = useState(false);
  const [mappedVerse, setMappedVerse] = useState<{ texto: string; ref: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowInitially] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const id = getOrSetUserId();
    const today = new Date().toISOString().split('T')[0];
    return localStorage.getItem(`mood_response_${id}`) !== today;
  });

  const shouldShow = isClient && !dismissed && shouldShowInitially;

  const handleSelection = useCallback(async (feeling: string) => {
    if (isLoading) return;
    const id = getOrSetUserId();
    if (!id) return;
    setIsLoading(true);
    let selectedFeeling = feeling;
    if (feeling === 'privado') {
      const storageKey = `private_clicks_${id}`;
      const count = parseInt(localStorage.getItem(storageKey) || '0') + 1;
      localStorage.setItem(storageKey, count.toString());
      if (count >= 5) selectedFeeling = getRandomFeeling();
    }
    try {
      const response = await fetch(`/api/humor?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeling: selectedFeeling, userId: id }),
      });
      const result = await response.json();
      setMappedVerse(result.data);
      localStorage.setItem(`mood_response_${id}`, new Date().toISOString().split('T')[0]);
    } catch (err) {
      console.error("Erro na rota de humor:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleClose = () => { setDismissed(true); setMappedVerse(null); };

  if (!shouldShow) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupCard}>
        <button className={styles.btnCloseX} onClick={handleClose} aria-label="Fechar">✕</button>
        {!mappedVerse ? (
          <div className={styles.selectionState}>
            <div className={styles.headerBox}>
              <h2 className={styles.title}>Como está se sentindo hoje?</h2>
            </div>
            {isLoading ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Buscando versículo...</p>
            ) : (
              <>
                <div className={styles.grid}>
                  {feelings.map((f) => (
                    <button key={f.id}
                      className={f.type === 'solid' ? styles.btnSolid : styles.btnOutline}
                      onClick={() => handleSelection(f.id)}>
                      {f.label}
                    </button>
                  ))}
                </div>
                <button className={styles.btnLong} onClick={() => handleSelection('privado')}>
                  Prefiro não dizer hoje
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={styles.verseWrapper}>
            <div className={styles.paperBase}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Itens Recortados/FolhasdePapel05.png" alt="Papel de Fundo" className={styles.imgFull} />
            </div>
            <div className={styles.mainPaper}>
              <div className={styles.tapeLayer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/Itens Recortados/Fita06.png" alt="Fita Adesiva" className={styles.imgFull} />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Itens Recortados/FolhasdePapel07.png" alt="Papel Versículo" className={styles.imgFull} />
              <div className={styles.verseContent}>
                <p className={styles.verseText}>&ldquo;{mappedVerse.texto}&rdquo;</p>
                <span className={styles.verseRef}>{mappedVerse.ref}</span>
                <button className={styles.btnFavorite} onClick={handleClose}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/Icones SVG/Icone.Coracao.svg" className={styles.favoriteIcon} alt="Favoritar" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}