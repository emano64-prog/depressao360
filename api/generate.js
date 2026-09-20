export default async function handler(req, res) {
// CORS headers para garantir compatibilidade total
res.setHeader('Access-Control-Allow-Credentials', true);
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

if (req.method === 'OPTIONS') {
res.status(200).end();
return;
}

if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: 'GEMINI_API_KEY não configurada na Vercel.' });
}

const body = req.body || {};
const textContent = body.contents || body.prompt || body.briefing || body.message || (typeof body === 'string' ? body : JSON.stringify(body));

if (!textContent) {
return res.status(400).json({ error: 'Nenhum texto de briefing foi fornecido.' });
}

// Usando o endpoint oficial e estável
const geminiResponse = await fetch(
`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: String(textContent) }] }]
})
}
);

const data = await geminiResponse.json();

if (!geminiResponse.ok) {
const errorMsg = data.error?.message || 'Erro desconhecido na API do Gemini';
console.error('Erro Google API:', errorMsg);
return res.status(500).json({ error: errorMsg });
}

const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

// Retorna no formato exato que qualquer frontend React espera
return res.status(200).json({
text: generatedText,
result: generatedText,
candidates: [{ content: { parts: [{ text: generatedText }] } }]
});

} catch (error) {
console.error('Erro interno no servidor:', error);
return res.status(500).json({ error: error.message || 'Erro interno ao processar requisição.' });
}
}
