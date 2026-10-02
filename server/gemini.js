// gemini.js
// Optional AI layer on top of the rule-based engine.
// When GEMINI_API_KEY is set, we ask Gemini to read the bill plus our
// rule-based draft and return a short human summary, three extra tips,
// and which action to do first. The rupee numbers always come from our
// engine, never from the model, so the AI tunes the words, not the maths.
// Any failure (no key, network error, bad response) returns null and the
// caller falls back to the rule-based plan quietly.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

async function enhanceWithGemini(bill, rulePlan) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const prompt =
    "You are helping an Indian household save electricity. " +
    "Here is their bill (rupees) and our calculated savings draft. " +
    "Do not invent new rupee amounts; use ours. " +
    "Reply with JSON only, no other text, in this shape: " +
    '{"summary": "2-3 warm sentences in plain words", "extraTips": ["tip 1", "tip 2", "tip 3"], "firstStep": "the single most useful first action and why, in one line"}. ' +
    "Bill: " + JSON.stringify(bill) + " " +
    "Our draft: " + JSON.stringify({
      wasteMonthlyRs: rulePlan.wasteMonthlyRs,
      wasteYearlyRs: rulePlan.wasteYearlyRs,
      breakdown: rulePlan.breakdown.map((b) => ({ key: b.key, monthlyRs: b.monthlyRs })),
    });

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    // The model sometimes wraps JSON in code fences; strip them.
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (!parsed.summary) return null;
    return {
      summary: String(parsed.summary).slice(0, 500),
      extraTips: Array.isArray(parsed.extraTips) ? parsed.extraTips.slice(0, 3).map(String) : [],
      firstStep: parsed.firstStep ? String(parsed.firstStep).slice(0, 300) : "",
    };
  } catch (e) {
    return null;
  }
}

module.exports = { enhanceWithGemini };
