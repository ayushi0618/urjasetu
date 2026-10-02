import { useEffect, useState } from "react";
import { t } from "../i18n.js";
import { api } from "../api.js";

// Dashboard: totals across every saved analysis, plus the list of
// past analyses to reopen.
export default function Dashboard({ lang, onOpen }) {
  const [stats, setStats] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([api.dashboard(), api.plans()]);
        setStats(s);
        setPlans(p);
      } catch (e) {
        console.error(e);
        setError(true);
      }
    })();
  }, []);

  if (error)
    return (
      <div className="flex items-start gap-3 rounded-[1.75rem] border border-red-200 bg-red-50 p-5">
        <span className="text-xl">😕</span>
        <p className="font-bold text-red-800">{t("err_analyze", lang)}</p>
      </div>
    );
  if (!stats)
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bar-shimmer h-24 rounded-[1.75rem] opacity-20" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    );

  const cards = [
    { label: t("stat_bills", lang), value: stats.billsAnalyzed, icon: "🧾", tint: "from-leaf/15 to-leaf/5", accent: "text-leafdark" },
    { label: t("stat_save_year", lang), value: "Rs. " + stats.yearlySavingsRs.toLocaleString("en-IN"), icon: "💰", tint: "from-amberwarm/15 to-amberwarm/5", accent: "text-amberwarm" },
    { label: t("stat_co2", lang), value: stats.co2YearlyKg + " kg", icon: "🌍", tint: "from-teal-600/15 to-teal-600/5", accent: "text-teal-700" },
    { label: t("stat_check", lang), value: stats.checklistPct + "%", icon: "✅", tint: "from-sky-600/15 to-sky-600/5", accent: "text-sky-700" },
  ];

  return (
    <div className="space-y-5">
      <div className="rise" style={{ "--d": 0 }}>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-stone-900">
          {t("dash_title", lang)}
        </h2>
        <p className="mt-0.5 text-stone-500">{t("dash_sub", lang)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className={`rise rounded-[1.75rem] border border-stone-200/80 bg-gradient-to-br ${c.tint} bg-white p-5 shadow-card`}
            style={{ "--d": i + 1 }}
          >
            <span className="text-2xl">{c.icon}</span>
            <p className={`stat-number mt-2 text-[1.35rem] font-extrabold tracking-tight ${c.accent}`}>{c.value}</p>
            <p className="mt-1 text-[13px] font-medium leading-snug text-stone-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rise rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card sm:p-6" style={{ "--d": 5 }}>
        <h3 className="font-display text-lg font-extrabold tracking-tight text-stone-800">
          🕘 {t("past_title", lang)}
        </h3>
        {plans.length === 0 && (
          <div className="mt-4 rounded-2xl bg-stone-50 p-6 text-center">
            <p className="text-3xl">📭</p>
            <p className="mt-2 text-sm font-medium text-stone-500">{t("empty", lang)}</p>
          </div>
        )}
        <div className="mt-4 grid gap-2.5 lg:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-transparent bg-stone-50/80 px-4 py-3.5 transition-all hover:border-stone-200 hover:bg-white hover:shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-leaf/10 text-lg">
                  🧾
                </span>
                <div>
                  <p className="stat-number font-extrabold text-stone-800">Rs. {p.netBill}</p>
                  <p className="text-xs font-medium text-stone-500">
                    {new Date(p.createdAt).toLocaleDateString("en-IN")} ·{" "}
                    <span className="font-bold text-leafdark">Rs. {p.wasteMonthlyRs}</span>
                    {t("per_month", lang)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpen(p.id)}
                className="shrink-0 rounded-full bg-leafdeep px-5 py-2.5 text-sm font-bold text-white shadow-card transition-transform hover:scale-105 active:scale-95"
              >
                {t("view", lang)} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
