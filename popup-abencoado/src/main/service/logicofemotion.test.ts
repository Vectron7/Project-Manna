

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

import { describe, it, expect, beforeEach } from 'vitest'
import {
  LogicofEmotionService,
  ContadorRepositoryMock,
  type HumorInput,
} from './logicofemotion'

// ─── Helpers ────────────────────────────────────────────────────────────────

function criarServico() {
  const repo = new ContadorRepositoryMock()
  const servico = new LogicofEmotionService(repo)
  return { servico, repo }
}

async function simularNaoDizer(servico: LogicofEmotionService, vezes: number) {
  for (let i = 0; i < vezes; i++) {
    await servico.selecionarVersiculo({ humor: 'prefiro-nao-dizer' })
  }
}

// ─── Testes ─────────────────────────────────────────────────────────────────

describe('LogicofEmotionService', () => {

  describe('Contrato de saída', () => {
    it('sempre retorna texto e referencia como strings', async () => {
      const { servico } = criarServico()
      const resultado = await servico.selecionarVersiculo({ humor: 'feliz' })
      expect(typeof resultado.texto).toBe('string')
      expect(typeof resultado.referencia).toBe('string')
    })

    it('referencia formatada como "Livro Capítulo:Versículo"', async () => {
      const { servico } = criarServico()
      const resultado = await servico.selecionarVersiculo({ humor: 'feliz' })
      expect(resultado.referencia).toMatch(/^.+\s\d+:\d+$/)
    })

    it('texto nunca vazio para humores válidos', async () => {
      const { servico } = criarServico()
      const humores = ['feliz', 'neutro', 'triste', 'estressado', 'cansado'] as const
      for (const humor of humores) {
        const resultado = await servico.selecionarVersiculo({ humor })
        expect(resultado.texto.length).toBeGreaterThan(0)
      }
    })
  })

  describe('RN-01 — Fechamento sem seleção', () => {
    it('retorna versículo válido quando humor é null', async () => {
      const { servico } = criarServico()
      const resultado = await servico.selecionarVersiculo({ humor: null })
      expect(resultado.texto).toBeTruthy()
      expect(resultado.referencia).toBeTruthy()
    })

    it('NÃO incrementa o contador', async () => {
      const { servico, repo } = criarServico()
      await servico.selecionarVersiculo({ humor: null })
      await servico.selecionarVersiculo({ humor: null })
      await servico.selecionarVersiculo({ humor: null })
      const contador = await repo.buscarContador('default')
      expect(contador).toBe(0)
    })
  })

  describe('RN-02 — prefiro-nao-dizer (1 a 4x)', () => {
    it('retorna versículo válido', async () => {
      const { servico } = criarServico()
      const resultado = await servico.selecionarVersiculo({ humor: 'prefiro-nao-dizer' })
      expect(resultado.texto).toBeTruthy()
      expect(resultado.referencia).toBeTruthy()
    })

    it('incrementa contador a cada chamada', async () => {
      const { servico, repo } = criarServico()
      await simularNaoDizer(servico, 3)
      expect(await repo.buscarContador('default')).toBe(3)
    })

    it('contador chega a 4 após 4 chamadas', async () => {
      const { servico, repo } = criarServico()
      await simularNaoDizer(servico, 4)
      expect(await repo.buscarContador('default')).toBe(4)
    })
  })

  describe('RN-03 — prefiro-nao-dizer (5ª vez)', () => {
    it('na 5ª chamada retorna versículo válido', async () => {
      const { servico } = criarServico()
      await simularNaoDizer(servico, 4)
      const resultado = await servico.selecionarVersiculo({ humor: 'prefiro-nao-dizer' })
      expect(resultado.texto).toBeTruthy()
      expect(resultado.referencia).toBeTruthy()
    })

    it('contador NÃO reseta automaticamente após a 5ª chamada', async () => {
      const { servico, repo } = criarServico()
      await simularNaoDizer(servico, 5)
      expect(await repo.buscarContador('default')).toBe(5)
    })
  })

  describe('RN-04 — Emoção real', () => {
    it.each(['feliz', 'neutro', 'triste', 'estressado', 'cansado'] as const)(
      '"%s" retorna texto e referencia preenchidos',
      async (humor) => {
        const { servico } = criarServico()
        const resultado = await servico.selecionarVersiculo({ humor })
        expect(resultado.texto).toBeTruthy()
        expect(resultado.referencia).toBeTruthy()
      }
    )

    it('reseta contador para 0 após emoção real', async () => {
      const { servico, repo } = criarServico()
      await simularNaoDizer(servico, 3)
      await servico.selecionarVersiculo({ humor: 'feliz' })
      expect(await repo.buscarContador('default')).toBe(0)
    })

    it('reseta contador mesmo após 4 prefiro-nao-dizer', async () => {
      const { servico, repo } = criarServico()
      await simularNaoDizer(servico, 4)
      await servico.selecionarVersiculo({ humor: 'triste' })
      expect(await repo.buscarContador('default')).toBe(0)
    })
  })

  describe('RN-05 — Seleção aleatória', () => {
    it('50 chamadas ao mesmo humor retornam versículos válidos', async () => {
      const { servico } = criarServico()
      const resultados = await Promise.all(
        Array.from({ length: 50 }, () =>
          servico.selecionarVersiculo({ humor: 'feliz' })
        )
      )
      resultados.forEach((r) => {
        expect(r.texto).toBeTruthy()
        expect(r.referencia).toBeTruthy()
      })
    })

    it('retorna variação entre chamadas', async () => {
      const { servico } = criarServico()
      const referencias = new Set<string>()
      for (let i = 0; i < 50; i++) {
        const r = await servico.selecionarVersiculo({ humor: 'feliz' })
        referencias.add(r.referencia)
      }
      expect(referencias.size).toBeGreaterThan(1)
    })
  })

  describe('RN-06 — Fallback para humor desconhecido', () => {
    it('nunca lança erro para humor inválido', async () => {
      const { servico } = criarServico()
      const input = { humor: 'invalido' } as unknown as HumorInput
      await expect(servico.selecionarVersiculo(input)).resolves.not.toThrow()
    })

    it('retorna versículo válido para humor não mapeado', async () => {
      const { servico } = criarServico()
      const input = { humor: 'xyz' } as unknown as HumorInput
      const resultado = await servico.selecionarVersiculo(input)
      expect(resultado.texto).toBeTruthy()
      expect(resultado.referencia).toBeTruthy()
    })
  })

  describe('ContadorRepositoryMock', () => {
    it('inicia zerado para userId novo', async () => {
      const repo = new ContadorRepositoryMock()
      expect(await repo.buscarContador('novo')).toBe(0)
    })

    it('incrementa corretamente', async () => {
      const repo = new ContadorRepositoryMock()
      await repo.incrementarContador('u1')
      await repo.incrementarContador('u1')
      expect(await repo.buscarContador('u1')).toBe(2)
    })

    it('reseta para 0', async () => {
      const repo = new ContadorRepositoryMock()
      await repo.incrementarContador('u1')
      await repo.resetarContador('u1')
      expect(await repo.buscarContador('u1')).toBe(0)
    })

    it('isola contadores por userId', async () => {
      const repo = new ContadorRepositoryMock()
      await repo.incrementarContador('u1')
      await repo.incrementarContador('u1')
      await repo.incrementarContador('u2')
      expect(await repo.buscarContador('u1')).toBe(2)
      expect(await repo.buscarContador('u2')).toBe(1)
    })
  })
})
