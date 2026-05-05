export interface Livro {
  id: string;
  nome: string;
  capitulos: number;
}

export const ANTIGO_TESTAMENTO: Livro[] = [
  { id: 'genesis', nome: 'Gênesis', capitulos: 50 },
  { id: 'exodo', nome: 'Êxodo', capitulos: 40 },
  { id: 'levitico', nome: 'Levítico', capitulos: 27 },
  { id: 'numeros', nome: 'Números', capitulos: 36 },
  { id: 'deuteronomio', nome: 'Deuteronômio', capitulos: 34 },
  { id: 'josue', nome: 'Josué', capitulos: 24 },
  { id: 'juizes', nome: 'Juízes', capitulos: 21 },
  { id: 'rute', nome: 'Rute', capitulos: 4 },
  { id: '1 samuel', nome: '1 Samuel', capitulos: 31 },
  { id: '2 samuel', nome: '2 Samuel', capitulos: 24 },
  { id: '1 reis', nome: '1 Reis', capitulos: 22 },
  { id: '2 reis', nome: '2 Reis', capitulos: 25 },
  { id: '1 cronicas', nome: '1 Crônicas', capitulos: 29 },
  { id: '2 cronicas', nome: '2 Crônicas', capitulos: 36 },
  { id: 'esdras', nome: 'Esdras', capitulos: 10 },
  { id: 'neemias', nome: 'Neemias', capitulos: 13 },
  { id: 'ester', nome: 'Ester', capitulos: 10 },
  { id: 'jo', nome: 'Jó', capitulos: 42 },
  { id: 'salmos', nome: 'Salmos', capitulos: 150 },
  { id: 'proverbios', nome: 'Provérbios', capitulos: 31 },
  { id: 'eclesiastes', nome: 'Eclesiastes', capitulos: 12 },
  { id: 'canticos', nome: 'Cânticos', capitulos: 8 },
  { id: 'isaias', nome: 'Isaías', capitulos: 66 },
  { id: 'jeremias', nome: 'Jeremias', capitulos: 52 },
  { id: 'lamentacoes de jeremias', nome: 'Lamentações', capitulos: 5 },
  { id: 'ezequiel', nome: 'Ezequiel', capitulos: 48 },
  { id: 'daniel', nome: 'Daniel', capitulos: 12 },
  { id: 'oseias', nome: 'Oseias', capitulos: 14 },
  { id: 'joel', nome: 'Joel', capitulos: 3 },
  { id: 'amos', nome: 'Amós', capitulos: 9 },
  { id: 'obadias', nome: 'Obadias', capitulos: 1 },
  { id: 'jonas', nome: 'Jonas', capitulos: 4 },
  { id: 'miqueias', nome: 'Miquéias', capitulos: 7 },
  { id: 'naum', nome: 'Naum', capitulos: 3 },
  { id: 'habacuque', nome: 'Habacuque', capitulos: 3 },
  { id: 'sofonias', nome: 'Sofonias', capitulos: 3 },
  { id: 'ageu', nome: 'Ageu', capitulos: 2 },
  { id: 'zacarias', nome: 'Zacarias', capitulos: 14 },
  { id: 'malaquias', nome: 'Malaquias', capitulos: 4 }
];

export const NOVO_TESTAMENTO: Livro[] = [
  { id: 'mateus', nome: 'Mateus', capitulos: 28 },
  { id: 'marcos', nome: 'Marcos', capitulos: 16 },
  { id: 'lucas', nome: 'Lucas', capitulos: 24 },
  { id: 'joao', nome: 'João', capitulos: 21 },
  { id: 'atos', nome: 'Atos', capitulos: 28 },
  { id: 'romanos', nome: 'Romanos', capitulos: 16 },
  { id: '1 corintios', nome: '1 Coríntios', capitulos: 16 },
  { id: '2 corintios', nome: '2 Coríntios', capitulos: 13 },
  { id: 'galatas', nome: 'Gálatas', capitulos: 6 },
  { id: 'efesios', nome: 'Efésios', capitulos: 6 },
  { id: 'filipenses', nome: 'Filipenses', capitulos: 4 },
  { id: 'colossenses', nome: 'Colossenses', capitulos: 4 },
  { id: '1 tessalonicenses', nome: '1 Tessalonicenses', capitulos: 5 },
  { id: '2 tessalonicenses', nome: '2 Tessalonicenses', capitulos: 3 },
  { id: '1 timoteo', nome: '1 Timóteo', capitulos: 6 },
  { id: '2 timoteo', nome: '2 Timóteo', capitulos: 4 },
  { id: 'tito', nome: 'Tito', capitulos: 3 },
  { id: 'filemom', nome: 'Filemom', capitulos: 1 },
  { id: 'hebreus', nome: 'Hebreus', capitulos: 13 },
  { id: 'tiago', nome: 'Tiago', capitulos: 5 },
  { id: '1 pedro', nome: '1 Pedro', capitulos: 5 },
  { id: '2 pedro', nome: '2 Pedro', capitulos: 3 },
  { id: '1 joao', nome: '1 João', capitulos: 5 },
  { id: '2 joao', nome: '2 João', capitulos: 1 },
  { id: '3 joao', nome: '3 João', capitulos: 1 },
  { id: 'judas', nome: 'Judas', capitulos: 1 },
  { id: 'apocalipse', nome: 'Apocalipse', capitulos: 22 }
];

export const TODOS_LIVROS: Livro[] = [...ANTIGO_TESTAMENTO, ...NOVO_TESTAMENTO];