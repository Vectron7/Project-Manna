export interface FavoriteRecord {
  id: string;
  user_id: string;
  verse_id: string;
  origin: string;
}

export interface ToggleResult {
  action: 'added' | 'removed';
  favorite: FavoriteRecord | null;
}

export interface FavoriteRepository {
  toggleFavoriteStatus(userId: string, verseId: string): Promise<boolean>;
  addFavorite(userId: string, verseId: string, origin: string): Promise<FavoriteRecord>;
  removeFavorite(userId: string, verseId: string): Promise<void>;
  toggleFavorite(userId: string, verseId: string, origin: string): Promise<ToggleResult>;
  buscarFavoritos(userId: string): Promise<FavoriteRecord[]>;
}