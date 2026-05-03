import path from 'path'
import fs from 'fs'
import { MAPEAMENTO_HUMOR_VERSICULO } from '../../../lib/seed/mapping.seed.js'

// Slugs válidos que o frontend pode enviar
// TODO: [PENDÊNCIA - Luis] Validar se estes slugs correspondem ao que o frontend enviará.
export type HumorSlug =
  | 'feliz'
  | 'neutro'
  | 'triste'
  | 'estressado'
  | 'cansado'
  | 'prefiro-nao-dizer'

// Entrada do contrato público
export interface HumorInput {
  humor: HumorSlug | null
}

// Saída do contrato público
export interface VersiculoOutput {
  texto: string
  referencia: string // ex: "1 Tessalonicenses 5:16"
}

// Contrato do repositório — implementação real aguardando Gustavo
// TODO: [PENDÊNCIA - Gustavo] Implementar esta interface com MySQL real.
// Substituir ContadorRepositoryMock quando lib/db/connection.ts estiver disponível.
export interface ContadorRepository {
  buscarContador(userId: string): Promise<number>
  incrementarContador(userId: string): Promise<void>
  resetarContador(userId: string): Promise<void>
}

// Resultado interno da resolução de humor (não exposto ao frontend)
interface HumorResolvido {
  humorId: number
  deveIncrementarContador: boolean
  deveResetarContador: boolean
}

// TODO: [PENDÊNCIA - Gustavo] Esta classe é um mock em memória.
// Substituir por implementação MySQL quando lib/db/connection.ts estiver disponível.
// O contador perde estado ao reiniciar a aplicação enquanto este mock estiver ativo.
export class ContadorRepositoryMock implements ContadorRepository {
  readonly #contadores = new Map<string, number>()

  async buscarContador(userId: string): Promise<number> {
    return this.#contadores.get(userId) ?? 0
  }

  async incrementarContador(userId: string): Promise<void> {
    const atual = await this.buscarContador(userId)
    this.#contadores.set(userId, atual + 1)
  }

  async resetarContador(userId: string): Promise<void> {
    this.#contadores.set(userId, 0)
  }
}

export class LogicofEmotionService {
  readonly #caminhoBiblia: string
  readonly #LIMITE_NAO_DIZER = 5
  readonly #HUMOR_NEUTRO_ID = 2
  readonly #HUMOR_TRISTE_ID = 3

  // TODO: [PENDÊNCIA - Gustavo] Substituir ContadorRepositoryMock por implementação
  // MySQL real quando lib/db/connection.ts estiver disponível.
  // TODO: [PENDÊNCIA - Luis] userId fixo em 'default' — substituir pelo userId real
  // quando autenticação do frontend estiver disponível.
  constructor(
    private readonly contadorRepo: ContadorRepository = new ContadorRepositoryMock()
  ) {
    this.#caminhoBiblia = path.join(process.cwd(), 'lib', 'bible')
  }

  async selecionarVersiculo(input: HumorInput): Promise<VersiculoOutput> {
    try {
      const resolvido = this.#resolverHumor(input)
      await this.#atualizarContador(resolvido)
      const humorId = await this.#determinarHumorFinal(resolvido)
      return this.#sortearVersiculo(humorId)
    } catch {
      return this.#sortearVersiculo(this.#HUMOR_NEUTRO_ID)
    }
  }

  #resolverHumor(input: HumorInput): HumorResolvido {
    if (input.humor === null) {
      return {
        humorId: this.#HUMOR_NEUTRO_ID,
        deveIncrementarContador: false,
        deveResetarContador: false,
      }
    }

    if (input.humor === 'prefiro-nao-dizer') {
      return {
        humorId: this.#HUMOR_NEUTRO_ID,
        deveIncrementarContador: true,
        deveResetarContador: false,
      }
    }

    return {
      humorId: this.#mapearSlugParaId(input.humor),
      deveIncrementarContador: false,
      deveResetarContador: true,
    }
  }

  #mapearSlugParaId(slug: HumorSlug): number {
    const mapa: Record<string, number> = {
      feliz: 1,
      neutro: 2,
      triste: 3,
      estressado: 4,
      cansado: 5,
    }
    return mapa[slug] ?? this.#HUMOR_NEUTRO_ID
  }

  // TODO: [PENDÊNCIA - Gustavo] buscarContador chama o mock em memória.
  // Substituir pela query MySQL quando lib/db/connection.ts estiver disponível:
  //   const conn = await getConnection()
  //   const [rows] = await conn.query(
  //     'SELECT contador FROM usuario_contador WHERE user_id = ?', [userId]
  //   )
  //   return rows[0]?.contador ?? 0
  async #determinarHumorFinal(resolvido: HumorResolvido): Promise<number> {
    if (!resolvido.deveIncrementarContador) {
      return resolvido.humorId
    }

    const contador = await this.contadorRepo.buscarContador('default')

    if (contador >= this.#LIMITE_NAO_DIZER) {
      return this.#HUMOR_TRISTE_ID
    }

    return this.#HUMOR_NEUTRO_ID
  }

  #sortearVersiculo(humorId: number): VersiculoOutput {
    const mapeamento = MAPEAMENTO_HUMOR_VERSICULO.find(
      (h) => h.humorId === humorId
    )

    if (!mapeamento) {
      return this.#sortearVersiculo(this.#HUMOR_NEUTRO_ID)
    }

    const indice = Math.floor(Math.random() * mapeamento.versiculos.length)
    const verso = mapeamento.versiculos[indice]
    const texto = this.#lerTextoVersiculo(verso.livro, verso.capitulo, verso.versiculo)
    const referencia = this.#formatarReferencia(verso.livro, verso.capitulo, verso.versiculo)

    return { texto, referencia }
  }

  #lerTextoVersiculo(livro: string, capitulo: number, versiculo: number): string {
    try {
      const caminho = path.join(this.#caminhoBiblia, `${livro}.json`)
      const conteudo = fs.readFileSync(caminho, 'utf-8')
      const dados = JSON.parse(conteudo) as Record<string, Record<string, string>>[]

      const capituloStr = String(capitulo)
      const versiculoStr = String(versiculo)

      const secao = dados.find((item) => item[capituloStr] !== undefined)
      if (!secao) return ''

      return secao[capituloStr][versiculoStr] ?? ''
    } catch {
      return ''
    }
  }

  #formatarReferencia(livro: string, capitulo: number, versiculo: number): string {
    const nomeFormatado = livro
      .split(' ')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ')
    return `${nomeFormatado} ${capitulo}:${versiculo}`
  }

  // TODO: [PENDÊNCIA - Gustavo] atualizarContador chama o mock em memória.
  // Substituir pelas queries MySQL quando lib/db/connection.ts estiver disponível:
  //   const conn = await getConnection()
  //   if (resolvido.deveResetarContador) {
  //     await conn.query(
  //       'UPDATE usuario_contador SET contador = 0 WHERE user_id = ?', [userId]
  //     )
  //   }
  //   if (resolvido.deveIncrementarContador) {
  //     await conn.query(
  //       'UPDATE usuario_contador SET contador = contador + 1 WHERE user_id = ?', [userId]
  //     )
  //   }
  async #atualizarContador(resolvido: HumorResolvido): Promise<void> {
    if (resolvido.deveResetarContador) {
      await this.contadorRepo.resetarContador('default')
    }
    if (resolvido.deveIncrementarContador) {
      await this.contadorRepo.incrementarContador('default')
    }
  }
}