import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FavoriteService } from './favoriteService';

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: fromMock,
  },
}));
const mockRecord = {
  id: 'uuid-001',
  user_id: 'user_abc123',
  verse_id: 'verse-uuid-001',
  origin: 'popup',
};

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(() => {
    service = new FavoriteService();
    vi.clearAllMocks();
    fromMock.mockReset();
  });



  describe('toggleFavoriteStatus', () => {
    it('retorna true quando favorito existe', async () => {
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { id: 'uuid-001' },
                error: null,
              }),
            }),
          }),
        }),
      });

      const result = await service.toggleFavoriteStatus('user_abc123', 'verse-uuid-001');
      expect(result).toBe(true);
    });

    it('retorna false quando favorito não existe', async () => {
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      });

      const result = await service.toggleFavoriteStatus('user_abc123', 'verse-uuid-001');
      expect(result).toBe(false);
    });

    it('lança erro quando Supabase retorna error', async () => {
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Erro de conexão' },
              }),
            }),
          }),
        }),
      });

      await expect(
        service.toggleFavoriteStatus('user_abc123', 'verse-uuid-001')
      ).rejects.toThrow('Erro ao verificar favorito');
    });
  });

  

  describe('addFavorite', () => {
    it('retorna FavoriteRecord ao adicionar com sucesso', async () => {
      fromMock.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockRecord,
              error: null,
            }),
          }),
        }),
      });

      const result = await service.addFavorite('user_abc123', 'verse-uuid-001', 'popup');
      expect(result).toEqual(mockRecord);
    });

    it('lança erro quando Supabase falha ao inserir', async () => {
      fromMock.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Falha ao inserir' },
            }),
          }),
        }),
      });

      await expect(
        service.addFavorite('user_abc123', 'verse-uuid-001', 'popup')
      ).rejects.toThrow('Erro ao adicionar favorito');
    });
  });



  describe('removeFavorite', () => {
    it('remove favorito com sucesso sem retornar dados', async () => {
      fromMock.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      await expect(
        service.removeFavorite('user_abc123', 'verse-uuid-001')
      ).resolves.toBeUndefined();
    });

    it('lança erro quando Supabase falha ao deletar', async () => {
      fromMock.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { message: 'Falha ao deletar' },
            }),
          }),
        }),
      });

      await expect(
        service.removeFavorite('user_abc123', 'verse-uuid-001')
      ).rejects.toThrow('Erro ao remover favorito');
    });
  });



  describe('toggleFavorite', () => {
    it('adiciona favorito quando não existe — action: added', async () => {
      vi.spyOn(service, 'toggleFavoriteStatus').mockResolvedValue(false);
      vi.spyOn(service, 'addFavorite').mockResolvedValue(mockRecord);

      const result = await service.toggleFavorite('user_abc123', 'verse-uuid-001', 'popup');

      expect(result.action).toBe('added');
      expect(result.favorite).toEqual(mockRecord);
    });

    it('remove favorito quando já existe — action: removed', async () => {
      vi.spyOn(service, 'toggleFavoriteStatus').mockResolvedValue(true);
      vi.spyOn(service, 'removeFavorite').mockResolvedValue(undefined);

      const result = await service.toggleFavorite('user_abc123', 'verse-uuid-001', 'popup');

      expect(result.action).toBe('removed');
      expect(result.favorite).toBeNull();
    });

    it('lança erro quando toggleFavoriteStatus falha', async () => {
      vi.spyOn(service, 'toggleFavoriteStatus').mockRejectedValue(
        new Error('Erro ao verificar favorito')
      );

      await expect(
        service.toggleFavorite('user_abc123', 'verse-uuid-001', 'popup')
      ).rejects.toThrow('Erro ao verificar favorito');
    });
  });

  
  describe('buscarFavoritos', () => {
    it('retorna lista de favoritos do usuário', async () => {
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [mockRecord],
              error: null,
            }),
          }),
        }),
      });

      const result = await service.buscarFavoritos('user_abc123');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockRecord);
    });

    it('retorna array vazio quando usuário não tem favoritos', async () => {
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      const result = await service.buscarFavoritos('user_abc123');
      expect(result).toEqual([]);
    });

    it('lança erro quando Supabase falha na busca', async () => {
      fromMock.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Falha na busca' },
            }),
          }),
        }),
      });

      await expect(
        service.buscarFavoritos('user_abc123')
      ).rejects.toThrow('Erro ao buscar favoritos');
    });
  });
});