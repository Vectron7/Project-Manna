'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import styles from './popup.module.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const feelings = [
  { id: 'seguranca', label: 'Inseguro', type: 'outline' },
  { id: 'feliz', label: 'Feliz', type: 'solid' },
  { id: 'caminho', label: 'Perdido', type: 'outline' },
  { id: 'paz', label: 'Em Paz', type: 'solid' },
  { id: 'descanso', label: 'Cansado', type: 'outline' },
  { id: 'gratidao', label: 'Grato', type: 'outline' }
];

export default function Popup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsVisible(true);
        const { data, error } = await supabase.auth.signInAnonymously();
        if (data) console.log("Máquina reconhecida com ID:", data.user?.id);
        if (error) console.error("Erro ao identificar máquina:", error.message);
      }
    };

    initSession();
  }, []);

  const handleSelection = (feeling: string) => {
    console.log(`Sentimento selecionado: ${feeling}`);
    
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
        <div className={styles.popupCard}>
            <div className={styles.headerBox}>
            <h2 className={styles.title}>Como está se sentindo hoje?</h2>
            </div>

            <div className={styles.grid}>
            {feelings.map((f) => (
                <button key={f.id} className={f.type === 'solid' ? styles.btnSolid : styles.btnOutline}>
                {f.label}
                </button>
            ))}
            </div>

            <button className={styles.btnLong} onClick={() => handleSelection('privado')}>
            Prefiro nao dizer hoje
            </button>
        </div>
    </div>
  );
}