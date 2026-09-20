import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: 'GEMINI_API_KEY não foi configurada na Vercel.' });
}

const ai = new GoogleGenAI({ apiKey });
const { prompt, contents } = req.body;

const response = await ai.models.generateContent({
model: 'gemini-2.5-flash',
contents: contents || prompt,
});

return res.status(200).json({ text: response.text });
} catch (error) {
console.error(error);
return res.status(500).json({ error: error.message || 'Erro ao processar requisição na API.' });
}
}
