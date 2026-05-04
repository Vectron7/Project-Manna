import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { feeling, userId } = await req.json();

    console.log(`[LOG SERVER] User: ${userId} | Mood: ${feeling}`);

    const mockVerses = [
      { texto: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmo 23:1", tags: ["descanso", "paz"] },
      { texto: "Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!", ref: "Filipenses 4:4", tags: ["feliz", "gratidao"] },
      { texto: "Não fui eu que lhe ordenei? Seja forte e corajoso!", ref: "Josué 1:9", tags: ["seguranca", "caminho"] },
      { texto: "Em paz me deito e logo adormeço.", ref: "Salmo 4:8", tags: ["paz", "descanso"] },
      { texto: "Lâmpada para os meus pés é a tua palavra.", ref: "Salmo 119:105", tags: ["caminho"] }
    ];

    const filtered = mockVerses.filter(v => v.tags.includes(feeling));
    
    const selectedVerse = filtered.length > 0 
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : mockVerses[Math.floor(Math.random() * mockVerses.length)];

    return NextResponse.json({
      success: true,
      message: "Humor processado offline",
      data: selectedVerse
    });

  } catch (err) {
    console.error("Erro na API Route:", err);
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 }
    );
  }
}