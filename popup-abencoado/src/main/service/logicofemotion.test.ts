import fs from 'fs';
import path from 'path';

// Interface para o arquivo da Bíblia
interface BibleChapter {
  [chapterNumber: string]: {
    [verseNumber: string]: string;
  };
}

// Interface para seed com múltiplos capítulos
interface SeedMultipleChapters {
  [chapterNumber: string]: {
    [verseNumber: string]: string;
  };
}

// Resolução de caminhos
const BIBLE_DIR = path.resolve(__dirname, '../../../lib/bible');
const SEED_DIR = path.resolve(__dirname, '../../../lib/seed');
const REPORT_DIR = path.resolve(__dirname, '../../../test-reports');

// Garante que o diretório de relatórios existe
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

describe('Validação de Integridade: Bíblia vs Matriz de Seed', () => {
  
  if (!fs.existsSync(BIBLE_DIR)) {
    throw new Error(`Diretório da Bíblia não encontrado: ${BIBLE_DIR}`);
  }

  if (!fs.existsSync(SEED_DIR)) {
    throw new Error(`Diretório de Seed não encontrado: ${SEED_DIR}`);
  }

  const seedFiles = fs.readdirSync(SEED_DIR);
  const bibleFiles = fs.readdirSync(BIBLE_DIR).filter(file => file.endsWith('.json'));
  
  // Acumulador de relatório
  const report: string[] = [];
  const errors: { book: string; missingVerses: { chapter: number; verse: number }[] }[] = [];

  report.push('='.repeat(80));
  report.push('RELATÓRIO DE VALIDAÇÃO BÍBLIA vs SEED');
  report.push(`Data: ${new Date().toLocaleString()}`);
  report.push('='.repeat(80));
  report.push('');

  test.each(bibleFiles)('Livro: %s', (bibleFile) => {
    const biblePath = path.join(BIBLE_DIR, bibleFile);
    
    const bibleNameBase = bibleFile.replace('.json', '');
    const bibleNameNoSpaces = bibleNameBase.replace(/\s+/g, '');
    
    const matchingSeedFile = seedFiles.find(f => {
      const seedNameBase = f.replace('.humor.json', '');
      return seedNameBase === bibleNameBase || seedNameBase === bibleNameNoSpaces;
    });

    if (!matchingSeedFile) {
      console.warn(`⚠ Seed não encontrado para: ${bibleFile}`);
      report.push(`❌ ${bibleFile}: Arquivo de seed NÃO ENCONTRADO`);
      report.push(`   - Esperado: ${bibleNameBase}.humor.json`);
      report.push(`   - Verifique se o arquivo existe na pasta lib/seed/`);
      report.push('');
      return;
    }

    const seedPath = path.join(SEED_DIR, matchingSeedFile);
    
    const bibleData: BibleChapter[] = JSON.parse(fs.readFileSync(biblePath, 'utf-8'));
    const seedDataRaw = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

    const getTagsForVerse = (chapter: number, verse: number): string[] => {
      if (Array.isArray(seedDataRaw)) {
        const chapterData = seedDataRaw.find((item: SeedMultipleChapters) => item[chapter]);
        if (chapterData && chapterData[chapter] && chapterData[chapter][verse]) {
          const tagsStr = chapterData[chapter][verse];
          try {
            return JSON.parse(tagsStr);
          } catch {
            return [tagsStr];
          }
        }
      } else if (typeof seedDataRaw === 'object' && seedDataRaw !== null) {
        if (seedDataRaw[verse]) {
          const tagsStr = seedDataRaw[verse];
          try {
            return JSON.parse(tagsStr);
          } catch {
            return [tagsStr];
          }
        }
      }
      return [];
    };

    const verseTagsMap: { chapter: number; verse: number; tags: string[] }[] = [];

    bibleData.forEach((chapterObj) => {
      const chapterNumber = parseInt(Object.keys(chapterObj)[0]);
      const verses = chapterObj[chapterNumber];
      
      Object.keys(verses).forEach((verseNumber) => {
        const verseNum = parseInt(verseNumber);
        const tags = getTagsForVerse(chapterNumber, verseNum);
        
        verseTagsMap.push({
          chapter: chapterNumber,
          verse: verseNum,
          tags: tags
        });
      });
    });

    const missingVerses = verseTagsMap.filter(v => v.tags.length === 0);
    
    // Estatísticas
    const totalVerses = verseTagsMap.length;
    const taggedVerses = totalVerses - missingVerses.length;
    const coverage = ((taggedVerses / totalVerses) * 100).toFixed(2);
    
    // Adiciona ao relatório
    report.push(`📖 ${bibleFile}`);
    report.push(`   - Total de versículos: ${totalVerses}`);
    report.push(`   - Versículos com tags: ${taggedVerses}`);
    report.push(`   - Cobertura: ${coverage}%`);
    
    if (missingVerses.length > 0) {
      report.push(`   ⚠️ VERSÍCULOS FALTANDO TAGS: ${missingVerses.length}`);
      missingVerses.forEach(v => {
        report.push(`      → Capítulo ${v.chapter}, Versículo ${v.verse}`);
      });
      
      errors.push({
        book: bibleFile,
        missingVerses: missingVerses.map(v => ({ chapter: v.chapter, verse: v.verse }))
      });
    } else {
      report.push(`   ✅ Todos os versículos têm tags!`);
    }
    report.push('');

    // Validações do teste
    expect(missingVerses).toHaveLength(0);
    verseTagsMap.forEach(({ tags }) => {
      expect(tags.length).toBeGreaterThan(0);
      expect(Array.isArray(tags)).toBe(true);
    });
    
    const hasValidTags = verseTagsMap.some(v => 
      v.tags.length > 0 && v.tags[0] !== 'Nao aplicavel'
    );
    expect(hasValidTags).toBe(true);
    
    console.log(`✓ ${bibleFile}: ${totalVerses} versículos (${coverage}% coberto)`);
  });

  // Gera relatório após todos os testes
  afterAll(() => {
    const reportPath = path.join(REPORT_DIR, `validation-report-${Date.now()}.txt`);
    const summaryPath = path.join(REPORT_DIR, 'latest-report.txt');
    
    report.push('='.repeat(80));
    report.push('RESUMO FINAL');
    report.push('='.repeat(80));
    report.push(`Total de livros com problemas: ${errors.length}`);
    
    if (errors.length > 0) {
      report.push('');
      report.push('LIVROS QUE PRECISAM DE CORREÇÃO:');
      errors.forEach(err => {
        report.push(`\n📕 ${err.book}:`);
        report.push(`   ${err.missingVerses.length} versículos sem tags`);
        err.missingVerses.slice(0, 10).forEach(v => {
          report.push(`     - Capítulo ${v.chapter}, Versículo ${v.verse}`);
        });
        if (err.missingVerses.length > 10) {
          report.push(`     ... e mais ${err.missingVerses.length - 10} versículos`);
        }
      });
    }
    
    report.push('');
    report.push('='.repeat(80));
    report.push('COMO CORRIGIR:');
    report.push('1. Para cada versículo listado acima, adicione uma tag no arquivo .humor.json');
    report.push('2. Exemplo de tag: "13": "[\"Segurança\"]"');
    report.push('3. Múltiplas tags: "13": "[\"Segurança\", \"Paz\"]"');
    report.push('4. Se não se aplica, use: "13": "[\"Nao aplicavel\"]"');
    report.push('='.repeat(80));
    
    fs.writeFileSync(reportPath, report.join('\n'));
    fs.writeFileSync(summaryPath, report.join('\n'));
    
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
    console.log(`📄 Último relatório: ${summaryPath}`);
    
    if (errors.length > 0) {
      console.log(`\n⚠️ ATENÇÃO: ${errors.length} livro(s) precisam de correção!`);
      console.log(`   Verifique o relatório para mais detalhes.`);
    }
  });
});