/**
 * Mapeamento finalizado pela equipe: Humor → Versiculos
 * Nunca modificar este arquivo sem consenso da equipe
 * Fonte: Contexto de Stage 5 - contexto atualizado antes da etapa
 */

import type { HumorVersoMap } from './types.seed.ts';

export const MAPEAMENTO_HUMOR_VERSICULO: HumorVersoMap[] = [
  {
    humorId: 1,
    nomeHumor: 'feliz',
    versiculos: [
      { livro: '1 tessalonicenses', capitulo: 5, versiculo: 16 },
      { livro: '1 tessalonicenses', capitulo: 5, versiculo: 18 },
      { livro: '1 corintios', capitulo: 16, versiculo: 14 },
      { livro: '1 joao', capitulo: 1, versiculo: 4 },
      { livro: '1 pedro', capitulo: 1, versiculo: 8 },
    ],
  },
  {
    humorId: 2,
    nomeHumor: 'neutro',
    versiculos: [
      { livro: '1 pedro', capitulo: 5, versiculo: 8 },
      { livro: '1 corintios', capitulo: 16, versiculo: 13 },
      { livro: '1 timoteo', capitulo: 6, versiculo: 11 },
      { livro: '2 corintios', capitulo: 13, versiculo: 11 },
      { livro: '1 tessalonicenses', capitulo: 5, versiculo: 21 },
    ],
  },
  {
    humorId: 3,
    nomeHumor: 'triste',
    versiculos: [
      { livro: '2 corintios', capitulo: 1, versiculo: 3 },
      { livro: '2 corintios', capitulo: 1, versiculo: 4 },
      { livro: '1 pedro', capitulo: 1, versiculo: 3 },
      { livro: '1 joao', capitulo: 3, versiculo: 20 },
      { livro: '1 pedro', capitulo: 5, versiculo: 10 },
    ],
  },
  {
    humorId: 4,
    nomeHumor: 'estressado',
    versiculos: [
      { livro: '1 pedro', capitulo: 5, versiculo: 7 },
      { livro: '2 corintios', capitulo: 13, versiculo: 11 },
      { livro: '1 tessalonicenses', capitulo: 5, versiculo: 13 },
      { livro: '1 timoteo', capitulo: 2, versiculo: 2 },
      { livro: '2 corintios', capitulo: 12, versiculo: 9 },
    ],
  },
  {
    humorId: 5,
    nomeHumor: 'cansado',
    versiculos: [
      { livro: '2 corintios', capitulo: 4, versiculo: 16 },
      { livro: '1 tessalonicenses', capitulo: 5, versiculo: 14 },
      { livro: '1 corintios', capitulo: 15, versiculo: 58 },
      { livro: '1 pedro', capitulo: 5, versiculo: 10 },
      { livro: '2 corintios', capitulo: 1, versiculo: 5 },
    ],
  },
];
