'use client';
import styles from './landing.module.css';

export default function LandingPage() {
  const hora = typeof window !== 'undefined' ? new Date().getHours() : 0;
  
  let saudacao = 'Bom dia';
  if (hora >= 12 && hora < 18) saudacao = 'Boa tarde';
  else if (hora >= 18 || hora < 5) saudacao = 'Boa noite';

  return (
    <main className={styles.landingContainer}>
      <div className={styles.contentOverlay}>
        <p className={styles.messageCalligraffitti}>{saudacao}, Amado!</p>
        <p className={styles.messageCalligraffitti}>Que Deus esteja contigo!</p>
      </div>
    </main>
  );
}