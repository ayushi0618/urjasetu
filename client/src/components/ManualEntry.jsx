import { useState } from "react";
import { t } from "../i18n.js";

// Manual entry: for bills the OCR cannot read, or users who prefer typing.
// Also collects the home profile (fans, AC, fridge, bulbs) so the plan
// fits the household instead of using defaults.
const DEFAULT_HOME = { fans: 4, fansOld: true, acCount: 1, fridgeOld: false, bulbs: 5 };

export default function ManualEntry({ lang, onAnalyze, busy, error }) {
  const [bill, setBill] = useState({ netBill: "", energyCharge: "", fixedCharges: "", unitsKwh: "" });
  const [home, setHome] = useState(DEFAULT_HOME);

  const setB = (k, v) => setBill((b) => ({ ...b, [k]: v }));
  const setH = (k, v) => setHome((h) => ({ ...h, [k]: v }));

  const num = (label, value, onChange, icon) => (
    <label className="block rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3 transition focus-within:border-leaf focus-within:bg-white">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stone-500">
        <span>{icon}</span> {label}
      </span>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="focus-leaf stat-number mt-1 w-full bg-transparent text-2xl font-bold text-stone-900 placeholder:text-stone-300"
      />
    </label>
  );

  const yn = (label, value, onChange, icon) => (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-bold text-stone-700">
        <span className="text-lg">{icon}</span> {label}
      </span>
      <div className="flex gap-1.5 rounded-full bg-white p-1 shadow-sm border border-stone-200/70">
        {[
          { v: true, label: t("yes", lang) },
          { v: false, label: t("no", lang) },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onChange(o.v)}
            className={
              "rounded-full px-4 py-1.5 text-sm font-bold transition-all " +
              (value === o.v ? "bg-leaf text-white shadow" : "text-stone-500 hover:text-stone-700")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amberwarm/10 text-lg">✍️</span>
        <p className="font-extrabold tracking-tight text-stone-800">{t("m_title", lang)}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {num(t("f_net", lang), bill.netBill, (v) => setB("netBill", v), "🧾")}
        {num(t("f_energy", lang), bill.energyCharge, (v) => setB("energyCharge", v), "⚡")}
        {num(t("f_fixed", lang), bill.fixedCharges, (v) => setB("fixedCharges", v), "🏷️")}
        {num(t("f_units", lang), bill.unitsKwh, (v) => setB("unitsKwh", v), "🔢")}
      </div>

      <div className="mt-6 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf/10 text-lg">🏠</span>
        <p className="font-extrabold tracking-tight text-stone-800">{t("home_title", lang)}</p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {num(t("q_fans", lang), home.fans, (v) => setH("fans", v), "🌀")}
          {num(t("q_ac", lang), home.acCount, (v) => setH("acCount", v), "❄️")}
        </div>
        {num(t("q_bulbs", lang), home.bulbs, (v) => setH("bulbs", v), "💡")}
        {yn(t("q_fans_old", lang), home.fansOld, (v) => setH("fansOld", v), "🌀")}
        {yn(t("q_fridge_old", lang), home.fridgeOld, (v) => setH("fridgeOld", v), "🧊")}
      </div>

      <button
        onClick={() => onAnalyze(bill, home)}
        disabled={busy}
        className="mt-6 w-full rounded-2xl bg-gradient-to-b from-leaf to-leafdark px-6 py-4 text-lg font-extrabold text-white shadow-lift transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
      >
        {busy ? t("loading", lang) : <>✨ {t("btn_make_plan", lang)}</>}
      </button>
      {error && <p className="mt-3 text-center font-medium text-red-700">{t("err_analyze", lang)}</p>}
    </div>
  );
}
