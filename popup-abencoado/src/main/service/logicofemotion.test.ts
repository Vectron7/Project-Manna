import fs from 'fs';
import path from 'path';

interface BibleChapter {
  [chapterNumber: string]: {
    [verseNumber: string]: string;
  };
}

interface SeedMultipleChapters {
  [chapterNumber: string]: {
    [verseNumber: string]: string;
  };
}

const BIBLE_DIR = path.resolve(__dirname, '../../../lib/bible');
const SEED_DIR = path.resolve(__dirname, '../../../lib/seed');
const REPORT_DIR = path.resolve(__dirname, '../../../test-reports');

if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

describe('Validação de Integridade: Bíblia vs Matriz de Seed', () => {
  if (!fs.existsSync(BIBLE_DIR) || !fs.existsSync(SEED_DIR)) {
    throw new Error('Diretórios de dados não encontrados.');
  }

  const seedFiles = fs.readdirSync(SEED_DIR);
  const bibleFiles = fs.readdirSync(BIBLE_DIR).filter(file => file.endsWith('.json'));
  
  const report: string[] = [];
  const errors: { book: string; missingVerses: { chapter: number; verse: number }[] }[] = [];

  report.push(`RELATÓRIO DE VALIDAÇÃO - ${new Date().toLocaleString()}\n${'='.repeat(50)}\n`);

  test.each(bibleFiles)('Livro: %s', (bibleFile) => {
    const biblePath = path.join(BIBLE_DIR, bibleFile);
    const bibleNameBase = bibleFile.replace('.json', '');
    const bibleNameNoSpaces = bibleNameBase.replace(/\s+/g, '');
    
    const matchingSeedFile = seedFiles.find(f => {
      const seedNameBase = f.replace('.humor.json', '');
      return seedNameBase === bibleNameBase || seedNameBase === bibleNameNoSpaces;
    });

    if (!matchingSeedFile) {
      report.push(`❌ ${bibleFile}: Seed não encontrado.`);
      return;
    }

    const seedPath = path.join(SEED_DIR, matchingSeedFile);
    const bibleData: BibleChapter[] = JSON.parse(fs.readFileSync(biblePath, 'utf-8'));
    const seedDataRaw = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

    const getTagsForVerse = (chapter: number, verse: number): string[] => {
      if (Array.isArray(seedDataRaw)) {
        const chapterData = seedDataRaw.find((item: SeedMultipleChapters) => item[chapter]);
        if (chapterData?.[chapter]?.[verse]) {
          const tagsStr = chapterData[chapter][verse];
          try { return JSON.parse(tagsStr); } catch { return [tagsStr]; }
        }
      } else if (seedDataRaw && typeof seedDataRaw === 'object') {
        if (seedDataRaw[verse]) {
          const tagsStr = seedDataRaw[verse];
          try { return JSON.parse(tagsStr); } catch { return [tagsStr]; }
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
        verseTagsMap.push({
          chapter: chapterNumber,
          verse: verseNum,
          tags: getTagsForVerse(chapterNumber, verseNum)
        });
      });
    });

    const missingVerses = verseTagsMap.filter(v => v.tags.length === 0);
    const totalVerses = verseTagsMap.length;
    const coverage = (( (totalVerses - missingVerses.length) / totalVerses) * 100).toFixed(2);
    
    report.push(`📖 ${bibleFile} | Cobertura: ${coverage}% (${totalVerses} versículos)`);
    
    if (missingVerses.length > 0) {
      report.push(`   ⚠️ FALTANDO TAGS: ${missingVerses.length} versículos.`);
      errors.push({
        book: bibleFile,
        missingVerses: missingVerses.map(v => ({ chapter: v.chapter, verse: v.verse }))
      });
    }

    expect(missingVerses).toHaveLength(0);
    verseTagsMap.forEach(({ tags }) => {
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
    });
  });

  afterAll(() => {
    const summaryPath = path.join(REPORT_DIR, 'latest-report.txt');
    
    if (errors.length > 0) {
      report.push(`\n${'='.repeat(50)}\nLIVROS COM PENDÊNCIAS:`);
      errors.forEach(err => {
        report.push(`\n📕 ${err.book} (${err.missingVerses.length} erros)`);
        err.missingVerses.slice(0, 5).forEach(v => {
          report.push(`   - Cap ${v.chapter}, Ver ${v.verse}`);
        });
        if (err.missingVerses.length > 5) report.push(`   ... e mais ${err.missingVerses.length - 5}`);
      });
    } else {
      report.push(`\n✅ Integridade total confirmada.`);
    }
    
    fs.writeFileSync(summaryPath, report.join('\n'));
    console.log(`\n📄 Relatório consolidado em: ${summaryPath}`);
  });
});