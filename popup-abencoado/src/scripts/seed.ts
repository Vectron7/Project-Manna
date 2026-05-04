import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

interface BibleChapter {
  [chapterNumber: string]: {
    [verseNumber: string]: string;
  };
}

interface SeedData {
  [key: string]: string | number | boolean | string[] | SeedData | SeedData[] | undefined;
}

interface FinalVerse {
  id?: string;
  texto: string;
  referencia: string;
  book: string;
  chapter: number;
  verse: number;
  tags: string[];
}

dotenv.config({ path: '.env.local' });

const BIBLE_DIR = path.resolve(process.cwd(), 'lib/bible');
const SEED_DIR = path.resolve(process.cwd(), 'lib/seed');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatReference(book: string, chapter: number, verse: number): string {
  return `${book} ${chapter}:${verse}`;
}

async function syncBibleToSupabase() {
  try {
    console.log(`Procurando Bíblia em: ${BIBLE_DIR}`);
    console.log(`Procurando Seed em: ${SEED_DIR}`);
    
    if (!fs.existsSync(BIBLE_DIR)) {
      throw new Error(`Diretório da Bíblia não encontrado: ${BIBLE_DIR}`);
    }
    
    if (!fs.existsSync(SEED_DIR)) {
      throw new Error(`Diretório de Seed não encontrado: ${SEED_DIR}`);
    }

    const bibleFiles = fs.readdirSync(BIBLE_DIR).filter(file => file.endsWith('.json'));
    const seedFiles = fs.readdirSync(SEED_DIR);

    console.log(`Encontrados ${bibleFiles.length} arquivos da Bíblia`);
    console.log(`Encontrados ${seedFiles.length} arquivos de seed`);

    for (const bibleFile of bibleFiles) {
      const biblePath = path.join(BIBLE_DIR, bibleFile);
      const bibleNameBase = bibleFile.replace('.json', '');
      const bibleNameNoSpaces = bibleNameBase.replace(/\s+/g, '');

      const matchingSeedFile = seedFiles.find(f => {
        const seedNameBase = f.replace('.humor.json', '').replace('.json', '');
        return seedNameBase === bibleNameBase || seedNameBase === bibleNameNoSpaces;
      });

      if (!matchingSeedFile) {
        console.log(`⚠ Seed não encontrado para: ${bibleFile}`);
        continue;
      }

      console.log(`📖 Processando: ${bibleFile} -> ${matchingSeedFile}`);

      const bibleData: BibleChapter[] = JSON.parse(fs.readFileSync(biblePath, 'utf-8'));
      const seedDataRaw: SeedData | SeedData[] = JSON.parse(fs.readFileSync(path.join(SEED_DIR, matchingSeedFile), 'utf-8'));

      const finalVerses: FinalVerse[] = [];

      bibleData.forEach((chapterObj: BibleChapter) => {
        const chapterKey = Object.keys(chapterObj)[0];
        const chapterNumber = parseInt(chapterKey);
        const verses = chapterObj[chapterKey];

        Object.keys(verses).forEach((verseKey) => {
          const verseNum = parseInt(verseKey);
          const texto = verses[verseKey];

          let tags: string[] = [];
          
          if (Array.isArray(seedDataRaw)) {
            const chapterData = seedDataRaw.find((item: SeedData) => item[chapterNumber]);
            const tagsStr = (chapterData?.[chapterNumber] as SeedData)?.[verseNum];
            if (typeof tagsStr === 'string') {
              try { tags = JSON.parse(tagsStr); } catch { tags = [tagsStr]; }
            }
          } else if (seedDataRaw[verseNum]) {
            const tagsStr = seedDataRaw[verseNum];
            if (typeof tagsStr === 'string') {
              try { tags = JSON.parse(tagsStr); } catch { tags = [tagsStr]; }
            }
          }

          if (tags.length > 0) {
            const referencia = formatReference(bibleNameBase, chapterNumber, verseNum);
            
            finalVerses.push({
              texto,
              referencia,
              book: bibleNameBase,
              chapter: chapterNumber,
              verse: verseNum,
              tags
            });
          }
        });
      });

      if (finalVerses.length > 0) {
        console.log(`  - ${finalVerses.length} versículos para inserir`);
        
        const batchSize = 100;
        for (let i = 0; i < finalVerses.length; i += batchSize) {
          const batch = finalVerses.slice(i, i + batchSize);
          const { error } = await supabase.from('versiculos').upsert(batch, {
            onConflict: 'book,chapter,verse'
          });
          
          if (error) {
            console.error(`  ❌ Erro ao subir ${bibleNameBase}:`, error.message);
            break;
          }
        }
        console.log(`  ✅ ${bibleNameBase} sincronizado com sucesso!`);
      }
    }
    console.log("✅ Sincronização completa!");
  } catch (error) {
    console.error("❌ Erro fatal no seed:", error);
  }
}

syncBibleToSupabase();