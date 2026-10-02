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

  const num = (label, value, onChange) => (
    <label className="block">
      <span className="text-sm font-medium text-stone-600">{label}</span>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-lg outline-none focus:border-leaf"
      />
    </label>
  );

  const yn = (label, value, onChange) => (
    <div className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-2">
        {[
          { v: true, label: t("yes", lang) },
          { v: false, label: t("no", lang) },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onChange(o.v)}
            className={
              "rounded-full px-4 py-1.5 text-sm font-medium " +
              (value === o.v ? "bg-leaf text-white" : "bg-white border border-stone-200")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl bg-white p-5 border border-stone-200">
      <p className="mb-4 font-semibold">{t("m_title", lang)}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {num(t("f_net", lang), bill.netBill, (v) => setB("netBill", v))}
        {num(t("f_energy", lang), bill.energyCharge, (v) => setB("energyCharge", v))}
        {num(t("f_fixed", lang), bill.fixedCharges, (v) => setB("fixedCharges", v))}
        {num(t("f_units", lang), bill.unitsKwh, (v) => setB("unitsKwh", v))}
      </div>

      <p className="mt-6 mb-3 font-semibold">{t("home_title", lang)}</p>
      <div className="grid grid-cols-1 gap-3">
        <div className="grid grid-cols-2 gap-3">
          {num(t("q_fans", lang), home.fans, (v) => setH("fans", v))}
          {num(t("q_ac", lang), home.acCount, (v) => setH("acCount", v))}
        </div>
        {num(t("q_bulbs", lang), home.bulbs, (v) => setH("bulbs", v))}
        {yn(t("q_fans_old", lang), home.fansOld, (v) => setH("fansOld", v))}
        {yn(t("q_fridge_old", lang), home.fridgeOld, (v) => setH("fridgeOld", v))}
      </div>

      <button
        onClick={() => onAnalyze(bill, home)}
        disabled={busy}
        className="mt-5 w-full rounded-2xl bg-leaf px-6 py-4 text-lg font-semibold text-white disabled:opacity-50"
      >
        {busy ? t("loading", lang) : t("btn_make_plan", lang)}
      </button>
      {error && <p className="mt-3 text-red-700">{t("err_analyze", lang)}</p>}
    </div>
  );
}
