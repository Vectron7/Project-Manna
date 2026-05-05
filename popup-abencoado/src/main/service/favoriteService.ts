import { supabase } from '../../lib/supabase';
import type { FavoriteRecord, ToggleResult, FavoriteRepository } from '../types/favorite.types';

export class FavoriteService implements FavoriteRepository {

  async toggleFavoriteStatus(userId: string, verseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('verse_id', verseId)
        .maybeSingle();

      if (error) throw new Error(`Erro ao verificar favorito: ${error.message}`);

      return data !== null;
    } catch (error) {
      console.error('[FavoriteService] toggleFavoriteStatus:', error);
      throw error;
    }
  }

  async addFavorite(userId: string, verseId: string, origin: string): Promise<FavoriteRecord> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, verse_id: verseId, origin })
        .select()
        .single();

      if (error) throw new Error(`Erro ao adicionar favorito: ${error.message}`);

      return data as FavoriteRecord;
    } catch (error) {
      console.error('[FavoriteService] addFavorite:', error);
      throw error;
    }
  }

  async removeFavorite(userId: string, verseId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('verse_id', verseId);

      if (error) throw new Error(`Erro ao remover favorito: ${error.message}`);
    } catch (error) {
      console.error('[FavoriteService] removeFavorite:', error);
      throw error;
    }
  }

  async toggleFavorite(userId: string, verseId: string, origin: string): Promise<ToggleResult> {
    try {
      const isFavorited = await this.toggleFavoriteStatus(userId, verseId);

      if (isFavorited) {
        await this.removeFavorite(userId, verseId);
        return { action: 'removed', favorite: null };
      }

      const favorite = await this.addFavorite(userId, verseId, origin);
      return { action: 'added', favorite };
    } catch (error) {
      console.error('[FavoriteService] toggleFavorite:', error);
      throw error;
    }
  }

  async buscarFavoritos(userId: string): Promise<FavoriteRecord[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (error) throw new Error(`Erro ao buscar favoritos: ${error.message}`);

      return (data as FavoriteRecord[]) ?? [];
    } catch (error) {
      console.error('[FavoriteService] buscarFavoritos:', error);
      throw error;
    }
  }
}

export const favoriteService = new FavoriteService();