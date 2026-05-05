import { NextResponse } from 'next/server';
import { favoriteService } from '../../../main/service/favoriteService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const favoritos = await favoriteService.buscarFavoritos(userId);

    return NextResponse.json({ success: true, data: favoritos });
  } catch (error) {
    console.error('[API/favorites GET]', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar favoritos' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, verseId, origin } = await req.json();

    if (!userId || !verseId || !origin) {
      return NextResponse.json(
        { error: 'userId, verseId e origin são obrigatórios' },
        { status: 400 }
      );
    }

    const resultado = await favoriteService.toggleFavorite(userId, verseId, origin);

    return NextResponse.json({ success: true, data: resultado });
  } catch (error) {
    console.error('[API/favorites POST]', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar favorito' },
      { status: 500 }
    );
  }
}