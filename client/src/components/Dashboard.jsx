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

  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-red-700">{t("err_analyze", lang)}</p>;
  if (!stats) return <p className="p-4">{t("loading", lang)}</p>;

  const cards = [
    { label: t("stat_bills", lang), value: stats.billsAnalyzed },
    { label: t("stat_save_year", lang), value: "Rs. " + stats.yearlySavingsRs.toLocaleString("en-IN") },
    { label: t("stat_co2", lang), value: stats.co2YearlyKg + " kg" },
    { label: t("stat_check", lang), value: stats.checklistPct + "%" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">{t("dash_title", lang)}</h2>
        <p className="text-stone-500">{t("dash_sub", lang)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl bg-white p-5 border border-stone-200">
            <p className="stat-number text-2xl font-bold text-leafdark">{c.value}</p>
            <p className="mt-1 text-sm text-stone-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-5 border border-stone-200">
        <h3 className="font-bold text-lg">{t("past_title", lang)}</h3>
        {plans.length === 0 && <p className="mt-2 text-stone-500">{t("empty", lang)}</p>}
        <div className="mt-3 space-y-2">
          {plans.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div>
                <p className="font-semibold stat-number">Rs. {p.netBill}</p>
                <p className="text-xs text-stone-500">
                  {new Date(p.createdAt).toLocaleDateString("en-IN")} · Rs. {p.wasteMonthlyRs}
                  {t("per_month", lang)}
                </p>
              </div>
              <button
                onClick={() => onOpen(p.id)}
                className="rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white"
              >
                {t("view", lang)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
