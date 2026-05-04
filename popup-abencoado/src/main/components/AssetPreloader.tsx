'use client';

import { useEffect } from 'react';
import { ASSETS_TO_PRELOAD } from '../constants/assets';

export default function AssetPreloader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    Object.values(ASSETS_TO_PRELOAD).forEach((category) => {
      category.files.forEach((file) => {
        const img = new Image();
        
        img.onload = () => console.log(`Assets carregado: ${file}`);
        img.onerror = () => console.error(`Erro ao carregar: ${file} em ${category.path}`);
        
        img.src = `${category.path}/${file}`;
      });
    });
  }, []);

  return null;
}