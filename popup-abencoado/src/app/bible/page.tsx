'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './bible.module.css';
import Sidebar from '@/main/components/Sidebar';
import { ANTIGO_TESTAMENTO, NOVO_TESTAMENTO, Livro } from '@/main/constants/livrosBiblia';

interface Versiculo {
  numero: number;
  texto: string;
}

export default function BibliaPage() {
  const [view, setView] = useState<'livros' | 'capitulos' | 'texto'>('livros');
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === 'texto' && selectedBook && selectedChapter) {
      const fetchTexto = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/bible?book=${encodeURIComponent(selectedBook.id)}&chapter=${selectedChapter}`);
          if (response.ok) {
            const data = await response.json();
            setVersiculos(data);
          } else {
            setVersiculos([]);
          }
        } catch (error) {
          console.error('Erro ao buscar:', error);
          setVersiculos([]);
        } finally {
          setLoading(false);
        }
      };
      fetchTexto();
    }
  }, [view, selectedBook, selectedChapter]);

  const handleBookClick = (livro: Livro) => {
    setSelectedBook(livro);
    setView('capitulos');
  };

  const handleChapterClick = (cap: number) => {
    setSelectedChapter(cap);
    setView('texto');
  };

  const handleBackToLivros = () => {
    setView('livros');
    setSelectedBook(null);
    setSelectedChapter(null);
    setVersiculos([]);
  };

  const handleBackToCapitulos = () => {
    setView('capitulos');
    setSelectedChapter(null);
    setVersiculos([]);
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.backgroundContainer}>
        <Image
          src="/assets/Logo e Wallpapers/Wallpaper.Cristo.png"
          alt="Cristo"
          fill
          priority
          className={styles.backgroundImage}
        />
      </div>

      <Sidebar />

      <main className={styles.contentOverlay}>
        <div className={styles.mainPaper}>
          <nav className={styles.navigationHeader}>
            <button onClick={handleBackToLivros} className={styles.navButton}>
              Bíblia
            </button>
            {selectedBook && (
              <>
                <span className={styles.separator}>›</span>
                <button onClick={handleBackToCapitulos} className={styles.navButton}>
                  {selectedBook.nome}
                </button>
              </>
            )}
            {selectedChapter && view === 'texto' && (
              <>
                <span className={styles.separator}>›</span>
                <span className={styles.currentChapter}>Capítulo {selectedChapter}</span>
              </>
            )}
          </nav>

          <hr className={styles.divider} />

          <div className={styles.scrollContent}>
            {view === 'livros' && (
              <>
                <div className={styles.testamentoSection}>
                  <h2 className={styles.testamentoTitle}>Antigo Testamento</h2>
                  <div className={styles.gridSelecao}>
                    {ANTIGO_TESTAMENTO.map((livro) => (
                      <button
                        key={livro.id}
                        onClick={() => handleBookClick(livro)}
                        className={styles.bookButton}
                      >
                        {livro.nome}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.testamentoSection}>
                  <h2 className={styles.testamentoTitle}>Novo Testamento</h2>
                  <div className={styles.gridSelecao}>
                    {NOVO_TESTAMENTO.map((livro) => (
                      <button
                        key={livro.id}
                        onClick={() => handleBookClick(livro)}
                        className={styles.bookButton}
                      >
                        {livro.nome}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {view === 'capitulos' && selectedBook && (
              <div className={styles.gridSelecao}>
                {Array.from({ length: selectedBook.capitulos }, (_, i) => i + 1).map((cap) => (
                  <button
                    key={cap}
                    onClick={() => handleChapterClick(cap)}
                    className={styles.chapterButton}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            )}

            {view === 'texto' && (
              <div className={styles.fonteBiblica}>
                {loading ? (
                  <div className={styles.loadingContainer}>
                    <p>Carregando capítulo...</p>
                  </div>
                ) : (
                  versiculos.map((v) => (
                    <p key={v.numero} className={styles.verseParagraph}>
                      <strong className={styles.versiculoNumero}>{v.numero}</strong>
                      <span className={styles.verseText}>{v.texto}</span>
                    </p>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}