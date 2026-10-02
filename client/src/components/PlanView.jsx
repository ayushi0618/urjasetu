import { useState } from "react";
import { t } from "../i18n.js";
import { api } from "../api.js";

// The savings plan screen: big numbers first, then the breakdown,
// tips, AI note (when present), the 4-week checklist, and assumptions.
// Checklist ticks go to the backend and are mirrored in localStorage,
// so progress survives a refresh.
const BD_ICONS = {
  bd_fans: "🌀",
  bd_lights: "💡",
  bd_fridge: "🧊",
  bd_ac: "❄️",
  bd_standby: "🔌",
  bd_shift: "🌙",
};

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
  const totalChecks = plan.checklist.length;
  const doneChecks = plan.checklist.filter((c) => checks[c.key]).length;

  return (
    <div className="space-y-5">
      {/* Savings hero */}
      <div className="rise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-leafdeep via-leafdark to-leaf p-6 text-white shadow-lift sm:p-8" style={{ "--d": 0 }}>
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-amberglow/25 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold tracking-tight">{t("plan_title", lang)}</h2>
            <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              {plan.ai ? <>🤖 {t("ai_badge", lang)}</> : <>📊 {t("rule_badge", lang)}</>}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            {t("for_bill", lang)} <span className="stat-number font-bold text-white">Rs. {plan.bill.netBill}</span>
          </p>

          <p className="mt-5 text-[15px] text-white/80">{t("waste_found", lang)}</p>
          <p className="stat-number mt-1 font-display text-6xl font-extrabold tracking-tight">
            <span className="text-2xl font-bold text-white/70">Rs.</span> {plan.wasteMonthlyRs}
          </p>
          <p className="stat-number mt-1 text-lg font-semibold text-white/85">
            Rs. {plan.wasteYearlyRs.toLocaleString("en-IN")} {t("per_year", lang)}
          </p>

          {totalChecks > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs font-semibold text-white/70">
                <span>{t("checklist_title", lang)}</span>
                <span className="stat-number">{doneChecks}/{totalChecks}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amberglow to-amberwarm transition-all"
                  style={{ width: `${Math.round((doneChecks / totalChecks) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {plan.ai?.summary && (
            <p className="mt-5 rounded-2xl bg-white/10 p-4 text-[15px] leading-relaxed backdrop-blur-sm">
              {plan.ai.summary}
            </p>
          )}
          {plan.ai?.firstStep && (
            <p className="mt-3 text-[15px]">
              <span className="font-bold">{t("ai_first", lang)} </span>
              {plan.ai.firstStep}
            </p>
          )}
        </div>
      </div>

      {/* Breakdown + tips side by side on desktop */}
      <div className="grid items-start gap-5 lg:grid-cols-2">
      {/* Breakdown */}
      <div className="rise rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card sm:p-6" style={{ "--d": 1 }}>
        <h3 className="font-display text-lg font-extrabold tracking-tight text-stone-800">
          💸 {t("breakdown_title", lang)}
        </h3>
        <div className="mt-4 space-y-4">
          {plan.breakdown.map((b) => (
            <div key={b.key}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-bold text-stone-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-leaf/10 text-base">
                    {BD_ICONS[b.key] || "⚡"}
                  </span>
                  {t(b.key, lang)}
                </span>
                <span className="stat-number whitespace-nowrap font-bold text-stone-800">
                  Rs. {b.monthlyRs}
                  <span className="font-medium text-stone-400">{t("per_month", lang)}</span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-amberwarm to-amberglow"
                  style={{ width: `${Math.max(6, Math.round((b.monthlyRs / maxRs) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="rise rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card sm:p-6" style={{ "--d": 2 }}>
        <h3 className="font-display text-lg font-extrabold tracking-tight text-stone-800">
          🛠️ {t("tips_title", lang)}
        </h3>
        <ul className="mt-4 space-y-3">
          {plan.tips.map((tip, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-stone-50/80 p-3.5 text-[15px] leading-relaxed">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf text-sm font-bold text-white">
                ✓
              </span>
              <span className="text-stone-700">{t(tip.key, lang, tip.params)}</span>
            </li>
          ))}
          {(plan.ai?.extraTips || []).map((tip, i) => (
            <li key={"ai" + i} className="flex gap-3 rounded-2xl bg-amber-50 p-3.5 text-[15px] leading-relaxed">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amberwarm text-sm font-bold text-white">
                ✦
              </span>
              <span className="text-stone-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>

      {/* Checklist */}
      <div className="rise rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card sm:p-6" style={{ "--d": 3 }}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold tracking-tight text-stone-800">
            ✅ {t("checklist_title", lang)}
          </h3>
          <span className="stat-number rounded-full bg-leaf/10 px-3 py-1 text-sm font-extrabold text-leafdark">
            {doneChecks}/{totalChecks}
          </span>
        </div>
        <div className="grid items-start gap-x-8 lg:grid-cols-2">
        {weeks.map((w) => {
          const items = plan.checklist.filter((c) => c.week === w);
          const done = items.filter((c) => checks[c.key]).length;
          return (
            <div key={w} className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold uppercase tracking-widest text-stone-400">
                  {t("week", lang)} {w}
                </p>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-1.5 rounded-full bg-leaf transition-all"
                    style={{ width: `${items.length ? Math.round((done / items.length) * 100) : 0}%` }}
                  />
                </div>
              </div>
              <div className="mt-2 space-y-2">
                {items.map((c) => (
                  <label
                    key={c.key}
                    className={
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-all " +
                      (checks[c.key]
                        ? "border-leaf/30 bg-leaf/5"
                        : "border-transparent bg-stone-50/80 hover:border-stone-200 hover:bg-stone-50")
                    }
                  >
                    <input
                      type="checkbox"
                      checked={!!checks[c.key]}
                      onChange={() => toggle(c.key)}
                      className="mt-0.5 shrink-0"
                    />
                    <span
                      className={
                        "text-[15px] leading-relaxed " +
                        (checks[c.key] ? "text-stone-400 line-through" : "text-stone-700")
                      }
                    >
                      {t(c.key, lang)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* CO2 + assumptions side by side on desktop */}
      <div className="grid items-start gap-5 lg:grid-cols-2">
      {/* CO2 */}
      <div className="rise relative h-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-sky-900 to-teal-800 p-6 text-white shadow-card" style={{ "--d": 4 }}>
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative flex items-center gap-4">
          <span className="animate-float text-5xl">🌍</span>
          <div>
            <h3 className="font-bold text-white/85">{t("co2_title", lang)}</h3>
            <p className="stat-number font-display text-4xl font-extrabold tracking-tight">
              {plan.co2YearlyKg} <span className="text-xl font-bold text-white/70">kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="rise h-full rounded-[1.75rem] border border-amber-200/70 bg-amber-50 p-5 sm:p-6" style={{ "--d": 5 }}>
        <h3 className="font-bold text-amber-900">🔍 {t("assumptions_title", lang)}</h3>
        <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-amber-900/80">
          {plan.assumptions.map((a, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amberwarm">•</span>
              <span>{t(a.key, lang, a.params)}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>

      <button
        onClick={onNew}
        className="rise w-full rounded-2xl border-2 border-leaf/70 bg-white px-6 py-3.5 font-extrabold text-leafdark shadow-card transition-all hover:border-leaf hover:shadow-lift"
        style={{ "--d": 6 }}
      >
        ← {t("new_bill", lang)}
      </button>
    </div>
  );
}
