'use client';

import { useSyncExternalStore } from 'react';
import styles from './landing.module.css';

interface Verse {
  id: number;
  texto: string;
  referencia: string;
}

interface LandingPageProps {
  onSelectVerse?: (verse: Verse) => void;
}

const subscribe = () => () => {};

export default function LandingPage({ onSelectVerse }: LandingPageProps) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const handleTriggerVerse = () => {
    if (onSelectVerse) {
      onSelectVerse({
        id: Date.now(),
        texto: "Pois eu bem sei os planos que tenho para vós, diz o Senhor, planos de paz e não de mal.",
        referencia: "Jeremias 29:11"
      });
    }
  };

  if (!isClient) {
    return (
      <main className={styles.landingContainer}>
        <div className={styles.contentOverlay}>
          <p className={styles.messageCalligraffitti}>Bem-vindo, Amado!</p>
          <p className={styles.messageCalligraffitti}>Que Deus esteja contigo!</p>
        </div>
      </main>
    );
  }

  const saudacao = getSaudacao();

  return (
    <main className={styles.landingContainer} onClick={handleTriggerVerse} style={{ cursor: 'pointer' }}>
      <div className={styles.contentOverlay}>
        <p className={styles.messageCalligraffitti}>{saudacao}, Amado!</p>
        <p className={styles.messageCalligraffitti}>Que Deus esteja contigo!</p>
      </div>
    </main>
  );
}