import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BibleChapter {
  [chapter: string]: {
    [verse: string]: string;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookName = searchParams.get('book');
  const chapter = searchParams.get('chapter');

  console.log('Parâmetros recebidos:', { bookName, chapter });

  if (!bookName || !chapter) {
    return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'lib', 'bible', `${bookName}.json`);
    
    console.log('Buscando arquivo:', filePath);
    console.log('Arquivo existe?', fs.existsSync(filePath));
    
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filePath);
      return NextResponse.json({ error: `Arquivo ${bookName}.json não encontrado` }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const bibleData: BibleChapter[] = JSON.parse(fileContent);
    
    console.log('Livro carregado, capítulos disponíveis:', bibleData.map(item => Object.keys(item)[0]));
    
    const chapterData = bibleData.find((item) => item[chapter]);
    
    if (!chapterData || !chapterData[chapter]) {
      console.error(`Capítulo ${chapter} não encontrado`);
      return NextResponse.json({ error: `Capítulo ${chapter} não encontrado em ${bookName}` }, { status: 404 });
    }

    const versiculos = Object.entries(chapterData[chapter]).map(([numero, texto]) => ({
      numero: parseInt(numero),
      texto: texto as string
    }));

    console.log(`${versiculos.length} versículos encontrados para ${bookName} ${chapter}`);
    return NextResponse.json(versiculos);
  } catch (error) {
    console.error('Erro ao processar:', error);
    return NextResponse.json({ error: 'Erro ao processar JSON' }, { status: 500 });
  }
}