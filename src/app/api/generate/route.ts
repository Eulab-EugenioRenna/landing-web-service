import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const systemPrompt = "Sei un consulente digitale, UX strategist, copywriter e prompt engineer per sviluppo web. Devi trasformare la richiesta di un lead in un prompt completo per creare una landing page professionale one page. Usa solo le informazioni fornite dal cliente. Se mancano dati, proponi assunzioni ragionevoli ma segnala cosa andrebbe confermato. Il prompt finale deve essere chiaro, operativo e pronto per un coding agent. Deve includere struttura della pagina, tono, sezioni, CTA, stile visivo, contenuti, obiettivo conversione e indicazioni tecniche. Non generare codice, genera solo il prompt di sviluppo.";
    
    const userPrompt = `
Ecco i dati del lead per la landing page:
Nome Attività: ${data.businessName}
Settore: ${data.sector}
Servizi: ${data.services}
Obiettivo: ${data.mainGoal}
Colori Brand: ${data.brandColors}
Carattere Brand: ${data.brandPersonality}
Stile/Font Desiderato: ${data.desiredFont}
Contenuti Essenziali: ${data.contentNotes}
Sito Esistente: ${data.existingWebsite || 'Nessuno'}
Social: ${data.socialLinks || 'Nessuno'}
Note Aggiuntive: ${data.additionalNotes || 'Nessuna'}
    `;

    // Assume Ollama is running locally on port 11434
    // Make sure to configure your environment or use localhost
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const ollamaModel = process.env.OLLAMA_MODEL || "mistral";
    
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Ollama error:", errText);
      return NextResponse.json({ error: "Errore da Ollama" }, { status: 500 });
    }

    const json = await response.json();

    return NextResponse.json({ prompt: json.response });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
