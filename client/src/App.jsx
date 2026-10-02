import { useState } from "react";
import { t } from "./i18n.js";
import { api } from "./api.js";
import LanguageToggle from "./components/LanguageToggle.jsx";
import UploadBill from "./components/UploadBill.jsx";
import ManualEntry from "./components/ManualEntry.jsx";
import PlanView from "./components/PlanView.jsx";
import Dashboard from "./components/Dashboard.jsx";

// The demo bill: a real bill from Ghaziabad used in the hackathon pitch.
// Net Rs. 671, energy charge Rs. 507, about Rs. 100/month avoidable waste.
const DEMO_BILL = { netBill: 671, energyCharge: 507, fixedCharges: 164, unitsKwh: "" };
const DEMO_HOME = { fans: 4, fansOld: true, acCount: 1, fridgeOld: false, bulbs: 5 };

const STEPS = [
  { icon: "📸", title: "step1_title", desc: "step1_desc" },
  { icon: "🔍", title: "step2_title", desc: "step2_desc" },
  { icon: "🌱", title: "step3_title", desc: "step3_desc" },
];

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("urjasetu-lang") || "en");
  const [screen, setScreen] = useState("home"); // home | plan | dashboard
  const [tab, setTab] = useState("upload");
  const [planData, setPlanData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  function changeLang(l) {
    setLang(l);
    localStorage.setItem("urjasetu-lang", l);
  }

  async function analyze(bill, home) {
    setBusy(true);
    setError(false);
    try {
      const data = await api.analyze(bill, home || undefined);
      setPlanData(data);
      setScreen("plan");
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function openPlan(id) {
    setBusy(true);
    try {
      const full = await api.plan(id);
      setPlanData({ id: full.id, plan: full.plan });
      setScreen("plan");
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Sticky glass header */}
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => setScreen("home")} className="flex items-center gap-2.5 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf to-leafdeep text-xl text-white shadow-card">
              ⚡
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight text-leafdeep">UrjaSetu</span>
              <span className="block text-[11px] font-medium text-stone-500">{t("tagline", lang)}</span>
            </span>
          </button>
          <LanguageToggle lang={lang} setLang={changeLang} />
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 px-4 pb-3 sm:px-6">
          {[
            { id: "home", label: t("nav_home", lang), icon: "🏠" },
            { id: "dashboard", label: t("nav_dashboard", lang), icon: "📊" },
          ].map((n) => (
            <button
              key={n.id}
              onClick={() => setScreen(n.id)}
              className={
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all " +
                (screen === n.id || (n.id === "home" && screen === "plan")
                  ? "bg-leafdeep text-white shadow-card"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-leaf/50 hover:text-leafdeep")
              }
            >
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-6">
        {screen === "home" && (
          <div className="space-y-5">
            {/* Hero */}
            <div className="rise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-leafdeep via-leafdark to-leaf p-6 text-white shadow-lift sm:p-8 lg:p-12" style={{ "--d": 0 }}>
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-amberglow/25 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-amberglow animate-pulse-soft" />
                  {t("tagline", lang)}
                </span>
                <h1 className="mt-3 font-display text-[1.65rem] font-extrabold leading-tight tracking-tight sm:text-3xl">
                  {t("hero_title", lang)}
                </h1>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/80">{t("hero_sub", lang)}</p>
                <button
                  onClick={() => analyze(DEMO_BILL, DEMO_HOME)}
                  disabled={busy}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-amberglow to-amberwarm px-6 py-3.5 text-base font-bold text-white shadow-lift transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {busy ? t("loading", lang) : <>▶ {t("btn_demo", lang)}</>}
                </button>
                <p className="mt-2.5 text-xs text-white/60">{t("demo_note", lang)}</p>
              </div>
            </div>

            {/* Steps + input: side by side on desktop, stacked on phone */}
            <div className="grid gap-5 lg:grid-cols-5">
              {/* How it works */}
              <div className="rise rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card sm:p-6 lg:col-span-2" style={{ "--d": 1 }}>
                <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">{t("how_title", lang)}</h2>
                <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-5">
                  {STEPS.map((s, i) => (
                    <div key={s.title} className="relative text-center lg:flex lg:items-start lg:gap-4 lg:text-left">
                      {i < 2 && (
                        <span className="absolute right-[-14px] top-6 text-stone-300 lg:hidden">→</span>
                      )}
                      <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf/15 to-amberwarm/15 text-2xl lg:mx-0">
                        {s.icon}
                      </div>
                      <div>
                        <p className="mt-2 text-[13px] font-bold text-stone-800 lg:mt-0 lg:text-[15px]">{t(s.title, lang)}</p>
                        <p className="mt-1 hidden text-xs leading-relaxed text-stone-500 sm:block lg:text-[13px]">{t(s.desc, lang)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input tabs */}
              <div className="rise lg:col-span-3" style={{ "--d": 2 }}>
              <div className="flex gap-1 rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-card">
                {[
                  { id: "upload", label: t("tab_upload", lang), icon: "📸" },
                  { id: "manual", label: t("tab_manual", lang), icon: "✍️" },
                ].map((tb) => (
                  <button
                    key={tb.id}
                    data-tab={tb.id}
                    onClick={() => setTab(tb.id)}
                    className={
                      "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-bold transition-all " +
                      (tab === tb.id
                        ? "bg-leafdeep text-white shadow-card"
                        : "text-stone-500 hover:text-stone-700")
                    }
                  >
                    <span>{tb.icon}</span> {tb.label}
                  </button>
                ))}
              </div>

              <div key={tab} className="animate-fade-in pt-4">
                {tab === "upload" ? (
                  <UploadBill lang={lang} onAnalyze={analyze} busy={busy} error={error} />
                ) : (
                  <ManualEntry lang={lang} onAnalyze={analyze} busy={busy} error={error} />
                )}
              </div>
              </div>
            </div>
          </div>
        )}

        {screen === "plan" && planData && (
          <PlanView lang={lang} data={planData} onNew={() => setScreen("home")} />
        )}

        {screen === "dashboard" && <Dashboard lang={lang} onOpen={openPlan} />}
      </main>

      <footer className="border-t border-stone-200/70 px-4 py-8 text-center">
        <p className="text-sm font-semibold text-stone-500">⚡ UrjaSetu</p>
        <p className="mt-1 text-xs text-stone-400">{t("footer", lang)}</p>
      </footer>
    </div>
  );
}
