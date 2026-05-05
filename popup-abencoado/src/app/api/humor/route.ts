// src/app/api/humor/route.ts - Versão Sem Erros
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Verse {
  id: string;
  texto: string;
  book: string;
  chapter: number;
  verse: number;
  referencia: string | null;
  tags: string[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const moodToTag: Record<string, string> = {
  seguranca: 'Segurança',
  feliz: 'Feliz',
  caminho: 'Caminho',
  paz: 'Paz',
  descanso: 'Descanso',
  gratidao: 'Gratidão'
};

// Cache em memória
const versesByTag: Record<string, Verse[]> = {};

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const { feeling, userId } = await req.json();
    const tag = moodToTag[feeling];
    
    if (!tag) {
      return NextResponse.json({ error: 'Sentimento inválido' }, { status: 400 });
    }

    // Se não tem cache para esta tag, buscar
    if (!versesByTag[tag]) {
      const { data, error } = await supabase
        .from('versiculos')
        .select('texto, book, chapter, verse, referencia, id, tags')
        .contains('tags', [tag]);
        
      if (error || !data || data.length === 0) {
        return NextResponse.json({ error: 'Nenhum versículo encontrado' }, { status: 404 });
      }
      
      versesByTag[tag] = data as Verse[];
      console.log(`[CACHE] Carregado ${data.length} versículos para ${tag}`);
    }
    
    // Sortear versículo aleatório
    const verses = versesByTag[tag];
    const randomIndex = Math.floor(Math.random() * verses.length);
    const randomVerse = verses[randomIndex];

    // Registrar daily_mood em background (sem await)
    const today = new Date().toISOString().split('T')[0];
    
    // Usar async/await dentro de uma IIFE para evitar erros
    (async () => {
      try {
        await supabase
          .from('daily_moods')
          .insert({
            user_id: userId,
            mood_type: feeling,
            verse_id: randomVerse.id,
            created_at: today
          });
      } catch (err) {
        console.error('[DAILY_MOOD] Erro ao registrar:', err);
      }
    })();

    const elapsed = Date.now() - startTime;
    console.log(`⚡ ${elapsed}ms - ${feeling} (${verses.length} versículos disponíveis)`);

    return NextResponse.json({
      success: true,
      data: {
        texto: randomVerse.texto,
        ref: randomVerse.referencia || `${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`
      }
    });

  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}