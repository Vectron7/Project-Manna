/**
 * Type definitions for humor→versiculo seed system
 * Strict TypeScript - all types fully specified
 */

/**
 * Referência canônica de um versículo
 * Usa chaves de livro/capitulo/versiculo para extrair do lib/bible/ JSON
 */
export interface VersoReferencia {
  livro: string; // e.g., "1 tessalonicenses", "2 corintios"
  capitulo: number;
  versiculo: number;
}

/**
 * Verso carregado do lib/bible/ com texto completo
 */
export interface Versiculo extends VersoReferencia {
  texto: string;
}

/**
 * Mapeamento: 1 Humor → N Versiculos
 * Definido no mapping.seed.ts
 */
export interface HumorVersoMap {
  humorId: number;
  nomeHumor: string;
  versiculos: VersoReferencia[];
}

/**
 * Registro pronto para INSERT no banco de dados
 */
export interface SeedRecord {
  humor_id: number;
  livro: string;
  capitulo: number;
  versiculo: number;
  texto: string;
  created_at: string;
}

/**
 * Resposta da execução do seed
 */
export interface ResultadoSeed {
  sucesso: boolean;
  linhasInseridas: number;
  duracao_ms: number;
  avisoIdempotencia?: string;
  erros?: string[];
}

/**
 * Estrutura interna do JSON da Bíblia
 * Formato: { "capitulo": { "versiculo": "texto", ... } }
 */
export interface BibliaEstrutura {
  [capitulo: string]: {
    [versiculo: string]: string;
  };
}
