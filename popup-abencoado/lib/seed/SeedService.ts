/**
 * SeedService: Orchestrador central da população inicial de humor→versiculo
 * Responsabilidades:
 * - Carregar Bíblia do lib/bible/
 * - Validar mapeamento da equipe
 * - Extrair textos dos versículos
 * - Gerar SQL INSERT
 * - Executar no MySQL
 * - Garantir idempotência
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type {
  BibliaEstrutura,
  HumorVersoMap,
  ResultadoSeed,
  SeedRecord,
  Versiculo,
  VersoReferencia,
} from './types.seed.ts';
import { MAPEAMENTO_HUMOR_VERSICULO } from './mapping.seed';

export class SeedService {
  // Caminho absoluto para pasta de Bíblia
  readonly #caminhobiblia: string;

  // Cache de Bíblia em memória durante execução
  #bibliaCarregada: Map<string, BibliaEstrutura> | null = null;

  constructor() {
    // Resolve lib/bible/ relative a este arquivo
    this.#caminhobiblia = join(process.cwd(), 'lib', 'bible');
  }

  /**
   * Método principal: executar seed completo
   * - Carrega Bíblia
   * - Valida mapeamento
   * - Constrói registros
   * - Insere no banco
   */
  async executarSeed(): Promise<ResultadoSeed> {
    const inicioMs = performance.now();

    try {
      console.log('[SeedService] Iniciando seed de humor→versiculo...');

      // Step 1: Verificar idempotência
      const jaSemeado = await this.#jaSemeado();
      if (jaSemeado) {
        const duracao = performance.now() - inicioMs;
        console.log('[SeedService] ⏭️  Seed já foi executado anteriormente.');
        return {
          sucesso: true,
          linhasInseridas: 0,
          duracao_ms: Math.round(duracao),
          avisoIdempotencia:
            'Seed já executado. Remova registros de humor_versiculo_map manualmente para re-executar.',
        };
      }

      // Step 2: Carregar Bíblia
      console.log('[SeedService] 📖 Carregando Bíblia de lib/bible/...');
      this.#bibliaCarregada = await this.#carregarBiblia();
      console.log(`[SeedService] ✅ ${this.#bibliaCarregada.size} livros carregados`);

      // Step 3: Validar mapeamento
      console.log('[SeedService] ✔️  Validando mapeamento da equipe...');
      const validacao = await this.#validarMapeamentoExistente(
        MAPEAMENTO_HUMOR_VERSICULO
      );
      if (!validacao.valido) {
        throw new Error(
          `Versículos faltantes na Bíblia: ${validacao.faltantes.join(', ')}`
        );
      }
      console.log('[SeedService] ✅ Mapeamento validado');

      // Step 4: Extrair versículos
      console.log('[SeedService] 📝 Extraindo textos dos versículos...');
      const versiculosComTexto = await this.#extrairVersiculosComTexto(
        MAPEAMENTO_HUMOR_VERSICULO
      );
      console.log(`[SeedService] ✅ ${versiculosComTexto.length} versículos extraídos`);

      // Step 5: Construir registros
      console.log('[SeedService] 🔨 Construindo registros seed...');
      const registros = this.#construirRegistrosSeed(versiculosComTexto);

      // Step 6: Gerar SQL
      console.log('[SeedService] 📄 Gerando SQL INSERT...');
      const statements = this.#gerarInsertSQL(registros);

      // Step 7: Executar inserts
      console.log('[SeedService] 💾 Executando INSERT no banco...');
      const resultInsert = await this.#executarInsertsSQL(statements);

      const duracao = performance.now() - inicioMs;
      console.log(
        `[SeedService] ✨ Seed concluído com sucesso: ${resultInsert.linhas} registros inseridos em ${Math.round(duracao)}ms`
      );

      return {
        sucesso: true,
        linhasInseridas: resultInsert.linhas,
        duracao_ms: Math.round(duracao),
      };
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : 'Erro desconhecido no seed';
      console.error(`[SeedService] ❌ FALHA: ${mensagem}`);
      await this.#registrarOperacao('executarSeed', `ERRO: ${mensagem}`);

      const duracao = performance.now() - inicioMs;
      return {
        sucesso: false,
        linhasInseridas: 0,
        duracao_ms: Math.round(duracao),
        erros: [mensagem],
      };
    }
  }

  /**
   * Carrega todos os 66 livros da Bíblia do lib/bible/
   * Retorna Map<livro, estrutura>
   */
  async #carregarBiblia(): Promise<Map<string, BibliaEstrutura>> {
    const biblia = new Map<string, BibliaEstrutura>();

    const arquivos = await readdir(this.#caminhobiblia);
    const arquivosJSON = arquivos.filter((f) => f.endsWith('.json'));

    for (const arquivo of arquivosJSON) {
      const nomelivro = arquivo.replace('.json', '').toLowerCase();
      const caminhoArquivo = join(this.#caminhobiblia, arquivo);

      const conteudo = await readFile(caminhoArquivo, 'utf-8');
      const dadosJSON = JSON.parse(conteudo) as BibliaEstrutura[];

      // JSON vem como array com 1 elemento: [{ "1": { "1": "texto", ... } }]
      if (Array.isArray(dadosJSON) && dadosJSON.length > 0) {
        const estrutura = dadosJSON[0];
        biblia.set(nomelivro, estrutura);
      }
    }

    return biblia;
  }

  /**
   * Valida que todos os versículos do mapeamento existem na Bíblia carregada
   */
  async #validarMapeamentoExistente(mapeamento: HumorVersoMap[]): Promise<{
    valido: boolean;
    faltantes: string[];
  }> {
    const faltantes: string[] = [];

    if (!this.#bibliaCarregada) {
      throw new Error('Bíblia não carregada');
    }

    for (const humor of mapeamento) {
      for (const verso of humor.versiculos) {
        const livroNormalizado = verso.livro.toLowerCase();
        const estruturaLivro = this.#bibliaCarregada.get(livroNormalizado);

        if (!estruturaLivro) {
          faltantes.push(
            `${verso.livro} ${verso.capitulo}:${verso.versiculo} (livro não encontrado)`
          );
          continue;
        }

        const capituloStr = String(verso.capitulo);
        const versiculoStr = String(verso.versiculo);

        if (
          !estruturaLivro[capituloStr] ||
          !estruturaLivro[capituloStr][versiculoStr]
        ) {
          faltantes.push(
            `${verso.livro} ${verso.capitulo}:${verso.versiculo}`
          );
        }
      }
    }

    return {
      valido: faltantes.length === 0,
      faltantes,
    };
  }

  /**
   * Extrai textos completos dos versículos do mapeamento
   */
  async #extrairVersiculosComTexto(
    mapeamento: HumorVersoMap[]
  ): Promise<Versiculo[]> {
    const versiculos: Versiculo[] = [];

    if (!this.#bibliaCarregada) {
      throw new Error('Bíblia não carregada');
    }

    for (const humor of mapeamento) {
      for (const verso of humor.versiculos) {
        const texto = await this.#extrairVersiculo(
          verso.livro,
          verso.capitulo,
          verso.versiculo
        );
        versiculos.push(texto);
      }
    }

    return versiculos;
  }

  /**
   * Extrai um único versículo do lib/bible/ usando livro+capitulo+versiculo como chaves
   */
  async #extrairVersiculo(
    livro: string,
    capitulo: number,
    versiculo: number
  ): Promise<Versiculo> {
    if (!this.#bibliaCarregada) {
      throw new Error('Bíblia não carregada');
    }

    const livroNormalizado = livro.toLowerCase();
    const estruturaLivro = this.#bibliaCarregada.get(livroNormalizado);

    if (!estruturaLivro) {
      throw new Error(`Livro não encontrado: ${livro}`);
    }

    const capituloStr = String(capitulo);
    const versiculoStr = String(versiculo);
    const texto = estruturaLivro[capituloStr]?.[versiculoStr];

    if (!texto) {
      throw new Error(
        `Versículo não encontrado: ${livro} ${capitulo}:${versiculo}`
      );
    }

    return {
      livro: livro.toLowerCase(),
      capitulo,
      versiculo,
      texto,
    };
  }

  /**
   * Transforma versículos com texto em SeedRecords prontos para INSERT
   */
  #construirRegistrosSeed(versiculos: Versiculo[]): SeedRecord[] {
    const agora = new Date().toISOString();
    const registros: SeedRecord[] = [];

    // Buscar humorId para cada versículo usando o mapeamento
    for (const verso of versiculos) {
      const humorParaEsteVerso = MAPEAMENTO_HUMOR_VERSICULO.find((humor) =>
        humor.versiculos.some(
          (v) =>
            v.livro.toLowerCase() === verso.livro.toLowerCase() &&
            v.capitulo === verso.capitulo &&
            v.versiculo === verso.versiculo
        )
      );

      if (!humorParaEsteVerso) {
        throw new Error(
          `Versículo orfão (não mapeado): ${verso.livro} ${verso.capitulo}:${verso.versiculo}`
        );
      }

      registros.push({
        humor_id: humorParaEsteVerso.humorId,
        livro: verso.livro,
        capitulo: verso.capitulo,
        versiculo: verso.versiculo,
        texto: verso.texto,
        created_at: agora,
      });
    }

    return registros;
  }

  /**
   * Gera SQL INSERT statements a partir dos SeedRecords
   */
  #gerarInsertSQL(records: SeedRecord[]): string[] {
    const statements: string[] = [];

    // Batch INSERT para eficiência
    const chunkSize = 5;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const values = chunk
        .map(
          (r) =>
            `(${r.humor_id}, '${this.#escaparSQL(r.livro)}', ${r.capitulo}, ${r.versiculo}, '${this.#escaparSQL(r.texto)}', '${r.created_at}')`
        )
        .join(',\n  ');

      const sql = `INSERT INTO humor_versiculo_map (humor_id, livro, capitulo, versiculo, texto, created_at) VALUES\n  ${values};`;
      statements.push(sql);
    }

    return statements;
  }

  /**
   * Utilitário: escapa aspas simples no SQL
   */
  #escaparSQL(texto: string): string {
    return texto.replace(/'/g, "''");
  }

  /**
   * Verifica se seed já foi executado (idempotência)
   * Placeholder: aguarda conexão MySQL implementada por outro dev
   */
  async #jaSemeado(): Promise<boolean> {
    try {
      // TODO: [PENDÊNCIA] Aguardando conexão MySQL implementada por outro dev.
      // Substituir este mock quando lib/db/connection.ts estiver disponível.

      // Mock: sempre retorna false (permite execução)
      // const connection = await obterConexaoMySQL();
      // const [rows] = await connection.query(
      //   'SELECT COUNT(*) as total FROM humor_versiculo_map LIMIT 1'
      // );
      // return (rows as any[])[0]?.total > 0;

      return false;
    } catch (erro) {
      console.warn('[SeedService] Não foi possível verificar idempotência:', erro);
      // Por segurança, retorna true para evitar re-execução acidental
      return true;
    }
  }

  /**
   * Executa INSERT statements no MySQL dentro de uma transação
   * Placeholder: aguarda conexão MySQL implementada por outro dev
   */
  async #executarInsertsSQL(statements: string[]): Promise<{
    linhas: number;
    duracao_ms: number;
  }> {
    const inicio = performance.now();

    try {
      // TODO: [PENDÊNCIA] Aguardando conexão MySQL implementada por outro dev.
      // Substituir este mock quando lib/db/connection.ts estiver disponível.

      // Mock: simula execução bem-sucedida
      // const connection = await obterConexaoMySQL();
      // await connection.query('START TRANSACTION');
      // try {
      //   for (const statement of statements) {
      //     await connection.query(statement);
      //   }
      //   await connection.query('COMMIT');
      //   const linhasInseridas = statements.length * 5; // ~5 registros por statement
      //   return { linhas: linhasInseridas, duracao_ms: performance.now() - inicio };
      // } catch (erro) {
      //   await connection.query('ROLLBACK');
      //   throw erro;
      // }

      const linhasInseridas = statements.length * 5; // Mock: 5 registros por statement
      const duracao = performance.now() - inicio;
      console.log(`[SeedService] Mock INSERT: ${linhasInseridas} linhas em ${Math.round(duracao)}ms`);

      return {
        linhas: linhasInseridas,
        duracao_ms: Math.round(duracao),
      };
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : 'Erro ao executar INSERT';
      throw new Error(`Falha ao inserir no banco: ${mensagem}`);
    }
  }

  /**
   * Registra operação no log (para auditoria futura)
   */
  async #registrarOperacao(etapa: string, status: string): Promise<void> {
    const timestamp = new Date().toISOString();
    console.log(`[SeedService:Log] ${timestamp} | ${etapa} | ${status}`);
    // Futuramente: salvar em log file ou banco de dados
  }
}
