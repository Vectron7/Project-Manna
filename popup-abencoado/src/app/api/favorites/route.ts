import { NextResponse } from 'next/server';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase'; 

interface FavoriteRequestBody {
  verseId: string;
}

export async function POST(req: Request) {
  try {
    const { verseId }: FavoriteRequestBody = await req.json();
    const STATIC_USER_ID = '00000000-0000-0000-0000-000000000000';

    console.log("Salvando favorito compartilhado para o versículo:", verseId);

    const { error } = await supabase
      .from('favorites') 
      .upsert([
        { 
          user_id: STATIC_USER_ID, 
          verse_id: verseId 
        }
      ], { onConflict: 'user_id,verse_id' });

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const err = error as PostgrestError;
    console.error("Erro Supabase:", err.message);

    return NextResponse.json(
      { error: err.message, code: err.code }, 
      { status: 500 }
    );
  }
}