// api.js
// Tiny wrapper around the backend endpoints. In dev, Vite proxies
// /api to localhost:5000. In production the same server serves both.

async function req(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  analyze: (bill, home) =>
    req("/api/analyze", { method: "POST", body: JSON.stringify({ bill, home }) }),
  plans: () => req("/api/plans"),
  plan: (id) => req(`/api/plans/${id}`),
  checklist: (id, key, done) =>
    req(`/api/plans/${id}/checklist`, { method: "POST", body: JSON.stringify({ key, done }) }),
  dashboard: () => req("/api/dashboard"),
};
