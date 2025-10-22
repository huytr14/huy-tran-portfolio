// ...new file...
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const TO_EMAIL = process.env.TO_EMAIL; // your target email (e.g. tghuy140104@gmail.com)
  const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@portfolio.local";

  if (!SENDGRID_API_KEY || !TO_EMAIL) {
    return res.status(500).json({ error: "Email not configured on server (SENDGRID_API_KEY / TO_EMAIL)" });
  }

  try {
    const { name, email, message, origin } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });

    const subject = `Portfolio contact from ${name}`;
    const text = `You have a new message from your portfolio site.\n\nName: ${name}\nEmail: ${email}\nOrigin: ${origin || "web"}\n\nMessage:\n${message}`;

    const payload = {
      personalizations: [{ to: [{ email: TO_EMAIL }] }],
      from: { email: FROM_EMAIL, name: "Portfolio Contact" },
      subject,
      content: [{ type: "text/plain", value: text }],
    };

    const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error("SendGrid error:", txt);
      return res.status(502).json({ error: "email_provider_error", details: txt });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("send-contact error", err);
    return res.status(500).json({ error: "internal" });
  }
}