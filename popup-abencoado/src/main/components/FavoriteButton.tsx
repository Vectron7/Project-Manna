'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FavoriteButtonProps {
  verseId: string;
}

export default function FavoriteButton({ verseId }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading || !verseId) {
      return;
    }

    const prevState = isFavorited;
    setIsFavorited(!prevState);
    setIsLoading(true);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verseId: verseId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro retornado pela API:", errorData);
        throw new Error('Erro na persistência');
      }
      
      console.log("Favorito atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao salvar favorito:", error);
      setIsFavorited(prevState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={isLoading}
      style={{ 
        background: 'none',
        border: 'none',
        cursor: isLoading ? 'wait' : 'pointer', 
        display: 'inline-block', 
        padding: '5px',
        outline: 'none'
      }}
      aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Image 
        src={isFavorited 
          ? "/assets/Icones SVG/Icone.CoracaoC.svg" 
          : "/assets/Icones SVG/Icone.Coracao.svg"
        }
        alt="Coração de Favorito"
        width={24}
        height={24}
        priority
        style={{
          opacity: isLoading ? 0.6 : 1,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />
    </button>
  );
}