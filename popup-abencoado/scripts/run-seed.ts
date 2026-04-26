/**
 * Entry point CLI para execução manual do seed
 * Uso: npx tsx scripts/run-seed.ts
 */

import { SeedService } from '../lib/seed/SeedService';

async function main(): Promise<void> {
  try {
    console.log('🚀 Pop-up Abençoado — Seed Humor→Versículo\n');

    const seedService = new SeedService();
    const resultado = await seedService.executarSeed();

    console.log('\n📊 Resultado Final:');
    console.log(`   Sucesso: ${resultado.sucesso}`);
    console.log(`   Linhas inseridas: ${resultado.linhasInseridas}`);
    console.log(`   Duração: ${resultado.duracao_ms}ms`);

    if (resultado.avisoIdempotencia) {
      console.log(`   ⚠️  ${resultado.avisoIdempotencia}`);
    }

    if (resultado.erros && resultado.erros.length > 0) {
      console.error('\n❌ Erros encontrados:');
      resultado.erros.forEach((erro) => console.error(`   • ${erro}`));
      process.exit(1);
    }

    console.log('\n✨ Seed executado com sucesso!');
    process.exit(0);
  } catch (erro) {
    console.error(
      '❌ Erro fatal:',
      erro instanceof Error ? erro.message : erro
    );
    process.exit(1);
  }
}

main();
