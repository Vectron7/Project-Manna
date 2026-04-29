// Slugs válidos que o frontend pode enviar
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

// Contrato do repositório — implementação real virá de lib/db/connection.ts
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