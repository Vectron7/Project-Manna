'use client';

import { useSyncExternalStore } from 'react';
import styles from './landing.module.css';

const subscribe = () => () => {};

export default function LandingPage() {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,  // Valor no Cliente
    () => false  // Valor no Servidor (SSR)
  );

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
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
    <main className={styles.landingContainer}>
      <div className={styles.contentOverlay}>
        <p className={styles.messageCalligraffitti}>{saudacao}, Amado!</p>
        <p className={styles.messageCalligraffitti}>Que Deus esteja contigo!</p>
      </div>
    </main>
  );
}