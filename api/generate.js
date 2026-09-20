import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
return res.status(200).end();
}

if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: 'GEMINI_API_KEY não configurada na Vercel.' });
}

const ai = new GoogleGenAI({ apiKey });

const body = req.body || {};
const textContent = body.contents || body.prompt || body.briefing || body.message || (typeof body === 'string' ? body : JSON.stringify(body));

if (!textContent) {
return res.status(400).json({ error: 'Nenhum texto fornecido.' });
}

// Utilizando o SDK oficial do Google, que valida corretamente as chaves do AI Studio
const response = await ai.models.generateContent({
model: 'gemini-1.5-flash',
contents: String(textContent),
});

const generatedText = response.text || '';

return res.status(200).json({
text: generatedText,
result: generatedText,
candidates: [{ content: { parts: [{ text: generatedText }] } }]
});

} catch (error) {
console.error('Erro na API:', error);
return res.status(500).json({ error: error.message || 'Erro ao processar na API do Google.' });
}
}
