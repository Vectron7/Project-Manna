'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

export default function Popup() {
  const [isVisible, setIsVisible] = useState(false);
  const [mappedVerse, setMappedVerse] = useState<{ texto: string; ref: string } | null>(null);

  useEffect(() => {
    // Usamos o seu utilitário de persistência para pegar o ID
    const id = getOrSetUserId();
    const today = new Date().toISOString().split('T')[0];
    const lastResponse = localStorage.getItem(`mood_response_${id}`);
    
    if (lastResponse !== today) {
      setIsVisible(true);
    }
  }, []);

  const handleSelection = useCallback(async (feeling: string) => {
    const id = getOrSetUserId();
    if (!id) return;

    let selectedFeeling = feeling;

    if (feeling === 'privado') {
      const storageKey = `private_clicks_${id}`;
      const count = parseInt(localStorage.getItem(storageKey) || '0') + 1;
      localStorage.setItem(storageKey, count.toString());
      if (count >= 5) selectedFeeling = getRandomFeeling();
    }

    try {
      const response = await fetch('/api/humor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeling: selectedFeeling, userId: id }),
      });

      const result = await response.json();
      
      // LOG FORMATADO: Agora você verá o texto diretamente no console
      console.log("✨ Versículo Gerado:", result.data.texto);
      console.log("📖 Referência:", result.data.ref);
      console.dir(result.data); // Exibe o objeto estruturado

      setMappedVerse(result.data);
      
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`mood_response_${id}`, today);
      
    } catch (err) {
      console.error("Erro na rota de humor:", err);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setMappedVerse(null); 
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupCard}>
        {!mappedVerse ? (
          <>
            <div className={styles.headerBox}>
              <h2 className={styles.title}>Como está se sentindo hoje?</h2>
            </div>

            <div className={styles.grid}>
              {feelings.map((f) => (
                <button 
                  key={f.id} 
                  className={f.type === 'solid' ? styles.btnSolid : styles.btnOutline}
                  onClick={() => handleSelection(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button className={styles.btnLong} onClick={() => handleSelection('privado')}>
              Prefiro não dizer hoje
            </button>
          </>
        ) : (
          <div className={styles.verseContainer}>
            <p className={styles.verseText}>&ldquo;{mappedVerse.texto}&rdquo;</p>
            <span className={styles.verseRef}>{mappedVerse.ref}</span>
            <button className={styles.btnClose} onClick={handleClose}>
              Amém
            </button>
          </div>
        )}
      </div>
    </div>
  );
}