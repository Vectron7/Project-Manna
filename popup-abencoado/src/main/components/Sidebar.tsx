'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './sidebar.module.css';

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
          <div className={styles.logoContainer}>
            <Image 
              src="/assets/Logo e Wallpapers/Logo.svg" 
              alt="Logo" 
              width={500} 
              height={500} 
            />
          </div>
          <div className={styles.saudacaoSide}>
            <p>Bom dia,</p>
            <p style={{ fontSize: '1.8rem' }}>Abençoado!</p>
          </div>
        </div>

        <nav className={styles.navLinks}>
          <a href="#biblia" className={styles.navItem}>
            <Image src="/assets/Icones SVG/Icone.Biblia.svg" alt="" width={30} height={30} />
            Bíblia
          </a>
          <a href="#favoritos" className={styles.navItem}>
            <Image src="/assets/Icones SVG/Icone.Coracao.svg" alt="" width={30} height={30} />
            Favoritos
          </a>
          <a href="#reflexoes" className={styles.navItem}>
            <Image src="/assets/Icones SVG/Icone.Coroa.svg" alt="" width={30} height={30} />
            Reflexões
          </a>
          <a href="#paraHoje" className={styles.navItem}>
            <Image src="/assets/Icones SVG/Icone.Maos.svg" alt="" width={30} height={30} />
            Para hoje
          </a>
        </nav>
      </div>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}