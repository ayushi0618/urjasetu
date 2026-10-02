import { useState } from "react";
import { t } from "../i18n.js";
import { api } from "../api.js";

// The savings plan screen: big numbers first, then the breakdown,
// tips, AI note (when present), the 4-week checklist, and assumptions.
// Checklist ticks go to the backend and are mirrored in localStorage,
// so progress survives a refresh.
export default function PlanView({ lang, data, onNew }) {
  const { id, plan } = data;
  const [checks, setChecks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("urjasetu-checks-" + id) || "{}");
    } catch {
      return {};
    }
  });

  async function toggle(key) {
    const done = !checks[key];
    const next = { ...checks, [key]: done };
    if (!done) delete next[key];
    setChecks(next);
    localStorage.setItem("urjasetu-checks-" + id, JSON.stringify(next));
    try {
      await api.checklist(id, key, done);
    } catch (e) {
      console.error("checklist save failed:", e);
    }
  }

  const maxRs = Math.max(...plan.breakdown.map((b) => b.monthlyRs), 1);
  const weeks = [1, 2, 3, 4];

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-leafdark p-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("plan_title", lang)}</h2>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
            {plan.ai ? t("ai_badge", lang) : t("rule_badge", lang)}
          </span>
        </div>
        <p className="mt-1 text-white/70 text-sm">
          {t("for_bill", lang)} Rs. {plan.bill.netBill}
        </p>
        <p className="mt-4 text-white/80">{t("waste_found", lang)}</p>
        <p className="stat-number mt-1 text-5xl font-bold">
          Rs. {plan.wasteMonthlyRs}
          <span className="text-xl font-medium text-white/70">{t("per_month", lang)}</span>
        </p>
        <p className="stat-number mt-1 text-lg text-white/85">
          Rs. {plan.wasteYearlyRs.toLocaleString("en-IN")} {t("per_year", lang)}
        </p>
        {plan.ai?.summary && (
          <p className="mt-4 rounded-2xl bg-white/10 p-4 text-[15px] leading-relaxed">{plan.ai.summary}</p>
        )}
        {plan.ai?.firstStep && (
          <p className="mt-3 text-[15px]">
            <span className="font-semibold">{t("ai_first", lang)} </span>
            {plan.ai.firstStep}
          </p>
        )}
      </div>

      <div className="rounded-3xl bg-white p-6 border border-stone-200">
        <h3 className="font-bold text-lg">{t("breakdown_title", lang)}</h3>
        <div className="mt-4 space-y-3">
          {plan.breakdown.map((b) => (
            <div key={b.key}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{t(b.key, lang)}</span>
                <span className="stat-number text-stone-600">
                  Rs. {b.monthlyRs}
                  {t("per_month", lang)} <span className="text-stone-400">({t("of_bill", lang)})</span>
                </span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-stone-100">
                <div
                  className="h-2.5 rounded-full bg-amberwarm"
                  style={{ width: `${Math.round((b.monthlyRs / maxRs) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 border border-stone-200">
        <h3 className="font-bold text-lg">{t("tips_title", lang)}</h3>
        <ul className="mt-3 space-y-3">
          {plan.tips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="text-leaf text-lg">✓</span>
              <span>{t(tip.key, lang, tip.params)}</span>
            </li>
          ))}
          {(plan.ai?.extraTips || []).map((tip, i) => (
            <li key={"ai" + i} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="text-leaf text-lg">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-white p-6 border border-stone-200">
        <h3 className="font-bold text-lg">{t("checklist_title", lang)}</h3>
        {weeks.map((w) => (
          <div key={w} className="mt-4">
            <p className="text-sm font-semibold text-stone-500">
              {t("week", lang)} {w}
            </p>
            <div className="mt-2 space-y-2">
              {plan.checklist
                .filter((c) => c.week === w)
                .map((c) => (
                  <label
                    key={c.key}
                    className={
                      "flex cursor-pointer items-start gap-3 rounded-2xl p-3 " +
                      (checks[c.key] ? "bg-green-50" : "bg-stone-50")
                    }
                  >
                    <input type="checkbox" checked={!!checks[c.key]} onChange={() => toggle(c.key)} className="mt-1" />
                    <span className={"text-[15px] leading-relaxed " + (checks[c.key] ? "line-through text-stone-400" : "")}>
                      {t(c.key, lang)}
                    </span>
                  </label>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 border border-stone-200">
        <h3 className="font-bold text-lg">🌍 {t("co2_title", lang)}</h3>
        <p className="stat-number mt-2 text-4xl font-bold text-leafdark">{plan.co2YearlyKg} kg</p>
      </div>

      <div className="rounded-3xl bg-amber-50 p-6 border border-amber-100">
        <h3 className="font-bold">{t("assumptions_title", lang)}</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-stone-600 space-y-1">
          {plan.assumptions.map((a, i) => (
            <li key={i}>{t(a.key, lang, a.params)}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onNew}
        className="w-full rounded-2xl border-2 border-leaf px-6 py-3.5 font-semibold text-leafdark"
      >
        {t("new_bill", lang)}
      </button>
    </div>
  );
}
