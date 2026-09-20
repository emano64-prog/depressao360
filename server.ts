import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `
Você é o "Expert Psicoeducativo Ético", especializado em psicologia clínica aplicada à comunicação para redes sociais.
Seu objetivo é criar ideias de conteúdos para psicólogos clínicos que desejam atrair pacientes de forma ética e informativa.

DIRETRIZ DE ANTIRREPETIÇÃO E VARIABILIDADE CRIATIVA:
Para garantir ideias e roteiros sempre frescos, originais e dinâmicos para as psicólogas (evitando clichês e repetições de estruturas visuais ou de tom), aplique permanentemente as seguintes regras de variabilidade e linguagem:

1. ALTERNÂNCIA DE GANCHOS (HOOKS):
Mude radicalmente o primeiro impacto do texto baseando-se no tipo de gancho solicitado ou selecionado:
- Pergunta provocativa: Baseada em sentimentos profundos e reais da paciente (ex: "Quem cuida de você quando você está desabando por dentro?").
- Quebra de expectativa crítica: Impacta por desafiar pensamentos automáticos (ex: "Fazer de tudo para agradar pode ser o seu jeito mais seguro de manter a solidão.").
- Cenário/Cena do cotidiano: Narrativo e imersivo (ex: "Você olha para o despertador acusando 3 da manhã. A casa está em silêncio puro, mas a sua mente está barulhenta.").
- Estatística ou fato sutil do comportamento humano: Aborda fatos psicológicos interessantes e instigantes para reflexão.

2. VARIAÇÃO DE ÂNGULOS DE ABORDAGEM:
Rotacione profundamente a perspectiva de análise:
- Ângulo Educativo: Explica didaticamente os processos psicológicos inconscientes ou hábitos de forma amigável e desmistificada.
- Ângulo de Identificação (Storytelling): Narra cenários ricos em termos de sentimentos comuns, gerando empatia instantânea com as pequenas lutas invisíveis do dia a dia.
- Ângulo Prático/Direto: Pragmático, fornecendo estratégias concretas de autopercepção saudável ou exercícios sutis de autorregulação.
- Ângulo de Acolhimento/Validação: Extremamente empático, suavizando a autocobrança desproporcional e focando em desfazer a sensação de inadequação ou culpa.

3. DIVERSIFICAÇÃO SINTÁTICA E ANTI-CLICHÊ:
- É TERMINANTEMENTE PROIBIDO usar palavras saturadas e clichês de infoprodutos (como "transformação", "jornada", "destrave", "destravar", "segredo", "mindset", "chave", "virada de chave", "fórmula", "fórmula mágica"). Escreva de forma puramente humana, sensata e poética-educativa.
- Varie o ritmo do texto: evite parágrafos de tamanhos sempre iguais ou parágrafos excessivamente curtos que pareçam tweets robotizados. Alterne entre descrições fluidas e sentenças de reflexão expressiva.

4. ÉTICA E SUBJETIVIDADE RÍGIDA:
- Baseie as análises puramente na psicologia científica reconhecida (TCC, fenomenologia, psicanálise, existencial, etc.) e na experiência clínica da paciente.
- NUNCA use termos de neurociência ou jargões da neurobiologia (como "neurotransmissores", "dopamina", "cortisol", "sistema límbico", "conexões neurais"). Fale estritamente da mente, sentimentos, relações e comportamento sob o prisma psicológico.
- RESTRICAO DE VOCABULÁRIO: NÃO utilize de forma alguma a palavra "Terapia". Substitua por "tratamento psicológico", "apoio psicológico", "ajuda profissional", "espaço clínico" ou "suporte psicológico".

ESTRUTURA DO CONTEÚDO (Para o campo "content"):
1. Um GANCHO detalhado que desperte identificação profunda de acordo com o estilo selecionado.
2. Uma breve EXPLICAÇÃO lúcida da dor, hábito ou angústia gerada.
3. Um trecho acolhedor de VALIDAÇÃO do sofrimento para restaurar a dignidade emocional.
4. Uma explicação prática de como a AJUDA EM TRATAMENTO PSICOLÓGICO age nessa engrenagem sutil.

FECHAMENTOS (São 3 tipos obrigatórios no campo "closings"):
1. Reflexão pessoal: Sem direcionamento comercial, promovendo o insight puro.
2. Convite para Apoio Psicológico: Auxilia o leitor a ponderar o momento adequado para iniciar esse suporte, com calma e absoluto respeito.
3. Convite para Consulta Inicial: Apresenta o primeiro contato como um espaço seguro, acolhedor e sem julgamentos para avaliação mútua e clareza diagnóstica primária.

REGRAS PARA CONVITES:
- Respeite o tempo da pessoa.
- Não induza medo ou urgência.
- Não pressione para continuidade.
- Deixe claro que o primeiro encontro pode ser apenas para clareza e caminhos.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    miniRaioX: {
      type: Type.OBJECT,
      properties: {
        emotion: { type: Type.STRING },
        pain: { type: Type.STRING },
        desire: { type: Type.STRING },
        conflict: { type: Type.STRING }
      },
      required: ["emotion", "pain", "desire", "conflict"]
    },
    content: { type: Type.STRING },
    titles: { 
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    variations: { 
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    closings: {
      type: Type.OBJECT,
      properties: {
        reflection: { type: Type.STRING },
        psychotherapyInvite: { type: Type.STRING },
        initialConsultationInvite: { type: Type.STRING }
      },
      required: ["reflection", "psychotherapyInvite", "initialConsultationInvite"]
    }
  },
  required: ["miniRaioX", "content", "titles", "closings"]
};

// API Routes
app.get("/api/health", (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    status: "ok",
    hasApiKey: Boolean(apiKey && apiKey.trim().length > 0)
  });
});

app.post("/api/generate", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return res.status(400).json({
      error: "A chave de API do Gemini (GEMINI_API_KEY) não foi detectada. Por favor, verifique se a chave foi inserida no menu de Configurações (Settings > Secrets) do AI Studio."
    });
  }

  const inputs = req.body;
  if (!inputs || !inputs.niche || !inputs.theme) {
    return res.status(400).json({
      error: "Por favor, preencha pelo menos o nicho e o tema do conteúdo."
    });
  }

  const hookInstruction = inputs.selectedHook && inputs.selectedHook !== "auto"
    ? `Utilize estritamente o seguinte tipo de GANCHO inicial: "${inputs.selectedHook}"`
    : "Selecione dinamicamente um dos quatros tipos de ganchos criativos exigidos na diretriz de antirrepetição (pergunta provocativa, quebra de expectativa, cena cotidiana ou estatística sutil)";

  const angleInstruction = inputs.selectedAngle && inputs.selectedAngle !== "auto"
    ? `Desenvolva todo o conteúdo sob a perspectiva do seguinte ÂNGULO DE ABORDAGEM: "${inputs.selectedAngle}"`
    : "Varie dinamicamente escolhendo um dos quatro ângulos de abordagem da diretriz criativa (educativo, storytelling identificação, prático/direto ou acolhimento/validação)";

  const prompt = `
Crie um conteúdo estratégico, profundamente humano e acolhedor para as redes sociais de uma psicóloga clínica.

DADOS DO BRIEFING:
- Nicho de atuação: ${inputs.niche}
- Público-Alvo: ${inputs.audience || "Adultos buscando equilíbrio emocional ou autoconhecimento"}
- Tema detalhado / Foco principal: ${inputs.theme}
- Formato de publicação final: ${inputs.contentType || "Post"}

INSTRUÇÕES ADICIONAIS PARA VARIABILIDADE CRIATIVA:
- ${hookInstruction}
- ${angleInstruction}

REGRAS IMPERATIVAS:
- Siga rigorosamente a diretriz de antirrepetição de estruturas e evite exaustivamente os termos rejeitados (como "transformação", "jornada", "destrave", "mindset", etc).
- Nunca utilize a palavra "Terapia" de nenhuma forma no roteiro ou nos fechamentos (use termos como "tratamento psicológico", "cuidados psicológicos" ou "apoio psicológico").
- Não cite explicações baseadas em neurociência, dopamina ou biologia. Mantenha o escopo na psicologia humana subjetiva, ética e clínica.
- O texto gerado deve ter alma, fugir completamente de receitas de bolo e soar autêntico de uma terapeuta experiente, empática e qualificada.
`;

  const genAI = new GoogleGenAI({ apiKey });

  // Intelligent model fallback list in case of temporary high-demand (503) or rate limits
  const modelCandidates = [
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-3-flash-preview"
  ];

  let lastError: any = null;

  for (const modelName of modelCandidates) {
    try {
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.8,
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || 0;
      const msg = err?.message || String(err);

      // If it's invalid key (400 or 403), no need to retry other models with the same invalid key
      if (status === 400 && (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID"))) {
        return res.status(401).json({
          error: "Chave de API do Gemini inválida. Por favor, verifique a chave copiada no Google AI Studio e atualize nas Configurações (Settings > Secrets)."
        });
      }
      if (status === 403) {
        return res.status(403).json({
          error: "Acesso negado com esta chave de API. Certifique-se de que a chave tem permissões ativas para o Gemini no Google AI Studio."
        });
      }

      console.warn(`Model ${modelName} encountered error: ${msg}. Trying next fallback candidate...`);
    }
  }

  // If all models failed
  console.error("All Gemini models failed:", lastError);
  const errorMsg = lastError?.message || String(lastError);

  if (errorMsg.includes("503") || errorMsg.includes("high demand") || errorMsg.includes("UNAVAILABLE")) {
    return res.status(503).json({
      error: "Os servidores do Gemini estão temporariamente com alta demanda. Por favor, tente novamente em alguns segundos."
    });
  }

  if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
    return res.status(429).json({
      error: "Limite de requisições ou cota da chave do Gemini atingido. Aguarde um instante antes de tentar novamente."
    });
  }

  return res.status(500).json({
    error: `Erro na comunicação com a IA: ${errorMsg}`
  });
});

// Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
