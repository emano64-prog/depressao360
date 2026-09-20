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
return res.status(500).json({ error: 'GEMINI_API_KEY não configurada.' });
}

const body = req.body || {};
const textContent = body.contents || body.prompt || body.briefing || body.message || (typeof body === 'string' ? body : JSON.stringify(body));

// Usando gemini-1.5-flash na v1beta (que é a versão padrão permitida para chaves do AI Studio)
const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: String(textContent) }] }]
})
}
);

const data = await response.json();

if (!response.ok) {
throw new Error(data.error?.message || 'Erro na API do Google');
}

const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

return res.status(200).json({
text: text,
result: text,
candidates: [{ content: { parts: [{ text: text }] } }]
});

} catch (error) {
console.error('Erro:', error);
return res.status(500).json({ error: error.message || 'Erro interno' });
}
}
