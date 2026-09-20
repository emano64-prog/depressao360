export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: 'GEMINI_API_KEY não foi configurada na Vercel.' });
}

const body = req.body || {};
const textContent = body.contents || body.prompt || body.briefing || body.message || (typeof body === 'string' ? body : JSON.stringify(body));

// Chamada direta via API REST do Google (ignora erros de pacotes SDK na Vercel)
const geminiResponse = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: textContent }] }]
})
}
);

const data = await geminiResponse.json();

if (!geminiResponse.ok) {
throw new Error(data.error?.message || 'Erro na API do Gemini');
}

const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

return res.status(200).json({
text: generatedText,
result: generatedText,
candidates: [{ content: { parts: [{ text: generatedText }] } }]
});

} catch (error) {
console.error(error);
return res.status(500).json({ error: error.message || 'Erro ao processar requisição na API.' });
}
}
