// Slugs válidos que o frontend pode enviar   -- luis precisa avaliar 
export type HumorSlug =
  | 'feliz'
  | 'neutro'
  | 'triste'
  | 'estressado'
  | 'cansado'
  | 'prefiro-nao-dizer'

// Entrada do contrato público 
export interface HumorInput 
{
  humor: HumorSlug | null
}

// Saída do contrato público
export interface VersiculoOutput 
{
  texto: string
  referencia: string // 
}

// Contrato do repositório — implementação real virá de lib/db/connection.ts
export interface ContadorRepository 
{
  buscarContador(userId: string): Promise<number>
  incrementarContador(userId: string): Promise<void>
  resetarContador(userId: string): Promise<void>
}

// Resultado interno da resolução de humor (não exposto ao frontend)
interface HumorResolvido 
{
  humorId: number
  deveIncrementarContador: boolean
  deveResetarContador: boolean
}


import path from 'path'
import fs from 'fs'
import { MAPEAMENTO_HUMOR_VERSICULO } from '../../../lib/seed/mapping.seed.js'


// TODO: [PENDÊNCIA] Aguardando implementação de conexão MySQL por outro dev.
// Substituir esta classe quando lib/db/connection.ts estiver disponível.
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

    constructor(
  private readonly contadorRepo: ContadorRepository
) {
  this.#caminhoBiblia = path.join(process.cwd(), 'lib', 'bible')
}

  async selecionarVersiculo(input: HumorInput): Promise<VersiculoOutput> 
  {
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

  #mapearSlugParaId(slug: HumorSlug): number   
    {
    const mapa: Record<string, number> = {
      feliz: 1,
      neutro: 2,
      triste: 3,
      estressado: 4,
      cansado: 5,
    }
    return mapa[slug] ?? this.#HUMOR_NEUTRO_ID
    }

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



  #sortearVersiculo(humorId: number): VersiculoOutput 
    {
    const mapeamento = MAPEAMENTO_HUMOR_VERSICULO.find
    (
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



  #formatarReferencia(livro: string, capitulo: number, versiculo: number): string 
    {
    const nomeFormatado = livro
      .split(' ')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ')
    return `${nomeFormatado} ${capitulo}:${versiculo}`
    }

  
  async #atualizarContador(resolvido: HumorResolvido): Promise<void>
    {
    // TODO: [PENDÊNCIA] Aguardando implementação de conexão MySQL por outro dev.
    // Substituir este mock quando lib/db/connection.ts estiver disponível.
    if (resolvido.deveResetarContador) {
      await this.contadorRepo.resetarContador('default')
    }
    if (resolvido.deveIncrementarContador) {
      await this.contadorRepo.incrementarContador('default')
    }
    }
}