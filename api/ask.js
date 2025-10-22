export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.LLAMA_API_KEY;
  const PROVIDER = (process.env.LLAMA_PROVIDER || "hf").toLowerCase(); // "hf" | "openai" | "custom"
  const MODEL = process.env.LLAMA_MODEL || ""; // e.g. "meta-llama/Llama-3-1" or provider-specific
  if (!API_KEY) return res.status(500).json({ error: "API key not configured on server" });

  try {
    const { question, profile, projects, experience, certificates } = req.body || {};
    if (!question) return res.status(400).json({ error: "Missing question" });

    // System instruction: require model to use only provided CV/context.
    const system = `You are an assistant that MUST answer user questions based PRIMARILY on the supplied candidate data (profile, projects, experience, certificates).
Do NOT invent facts. If the information is not present in the provided data, say "Không có trong CV" (or "I don't have that info") and optionally suggest how to obtain it.
Be concise and respond in the user's language.`;

    const context = {
      profile: profile || {},
      projects: projects || [],
      experience: experience || [],
      certificates: certificates || [],
    };

    // Compose prompt/content
    const userContent = `Context:\n${JSON.stringify(context, null, 2)}\n\nQuestion: ${question}\n\nAnswer concisely, using only context above.`;

    if (PROVIDER === "openai") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: MODEL || "gpt-3.5-turbo",
          messages: [{ role: "system", content: system }, { role: "user", content: userContent }],
          max_tokens: 512,
          temperature: 0.1,
        }),
      });
      if (!r.ok) {
        const txt = await r.text();
        return res.status(502).json({ error: "provider_error", details: txt });
      }
      const j = await r.json();
      const answer = j.choices?.[0]?.message?.content ?? "";
      return res.json({ answer });
    }

    if (PROVIDER === "hf") {
      // Hugging Face Inference API
      // MODEL should be like "meta-llama/Llama-3-1-..." as required by HF
      const r = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({ inputs: `${system}\n\n${userContent}`, parameters: { max_new_tokens: 512, temperature: 0.1 } }),
      });
      if (!r.ok) {
        const txt = await r.text();
        return res.status(502).json({ error: "provider_error", details: txt });
      }
      const j = await r.json();
      const answer = Array.isArray(j) ? (j[0]?.generated_text ?? "") : (j?.generated_text ?? j?.text ?? "");
      return res.json({ answer });
    }

    if (PROVIDER === "custom") {
      // Call arbitrary endpoint set in LLAMA_API_URL
      const url = process.env.LLAMA_API_URL;
      if (!url) return res.status(500).json({ error: "Missing LLAMA_API_URL for custom provider" });
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({ prompt: `${system}\n\n${userContent}`, max_tokens: 512 }),
      });
      if (!r.ok) {
        const txt = await r.text();
        return res.status(502).json({ error: "provider_error", details: txt });
      }
      const j = await r.json();
      return res.json({ answer: j.answer ?? j.text ?? "" });
    }

    return res.status(400).json({ error: "Unknown provider" });
  } catch (err) {
    console.error("api/ask error", err);
    return res.status(500).json({ error: "internal" });
  }
}