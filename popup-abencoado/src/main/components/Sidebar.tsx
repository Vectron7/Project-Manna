'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './sidebar.module.css';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className={`${styles.menuBtn} ${isOpen ? styles.open : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
      >
        <Image 
          src="/assets/Icones SVG/Icone.Menu.svg" 
          alt="Menu" 
          width={28} 
          height={28} 
          style={{ height: 'auto' }}
          priority
        />
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          {/* Envolvendo a Logo com Link para a Home */}
          <Link href="/" className={styles.logoContainer} onClick={() => setIsOpen(false)}>
            <Image 
              src="/assets/Logo e Wallpapers/Logo.svg" 
              alt="Logo" 
              width={500} 
              height={500} 
              priority
            />
          </Link>
          
          <div className={styles.saudacaoSide}>
            <p>Bom dia,</p>
            <p style={{ fontSize: '1.8rem' }}>Abençoado!</p>
          </div>
        </div>

        <nav className={styles.navLinks}>
          <Link href="/bible" className={styles.navItem}>
            <Image src="/assets/Icones SVG/Icone.Biblia.svg" alt="" width={30} height={30} />
            Bíblia
          </Link>
          <Link href="/favorites" className={styles.navItem} onClick={() => setIsOpen(false)}>
            <Image src="/assets/Icones SVG/Icone.Coracao.svg" alt="" width={30} height={30} />
            Favoritos
          </Link>
        </nav>
      </div>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}