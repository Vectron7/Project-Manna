import { describe, it } from 'vitest'

describe('LogicofEmotionService', () => {
  it.todo('RN-01: fechamento sem seleção retorna Neutro sem incrementar contador')
  it.todo('RN-02: prefiro-nao-dizer (1x) retorna Neutro e incrementa contador')
  it.todo('RN-02: prefiro-nao-dizer (4x) contador = 4')
  it.todo('RN-03: prefiro-nao-dizer (5x) retorna Triste')
  it.todo('RN-04: emoção real reseta contador para 0')
  it.todo('RN-04: feliz retorna versículo do humorId 1')
  it.todo('RN-04: neutro retorna versículo do humorId 2')
  it.todo('RN-04: triste retorna versículo do humorId 3')
  it.todo('RN-04: estressado retorna versículo do humorId 4')
  it.todo('RN-04: cansado retorna versículo do humorId 5')
  it.todo('RN-05: seleção aleatória retorna sempre um dos 5 versículos do humor')
  it.todo('RN-06: humor desconhecido retorna fallback Neutro sem erro')
  it.todo('contrato: saída sempre contém texto e referencia como strings')
  it.todo('contrato: referencia formatada como "Livro Capítulo:Versículo"')
})