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
    <div className="min-h-screen bg-cream">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <button onClick={() => setScreen("home")} className="text-left">
          <span className="text-2xl font-bold text-leafdark">⚡ UrjaSetu</span>
          <span className="block text-xs text-stone-500">{t("tagline", lang)}</span>
        </button>
        <LanguageToggle lang={lang} setLang={changeLang} />
      </header>

      <nav className="mx-auto flex max-w-2xl gap-2 px-4 pb-2">
        {[
          { id: "home", label: t("nav_home", lang) },
          { id: "dashboard", label: t("nav_dashboard", lang) },
        ].map((n) => (
          <button
            key={n.id}
            onClick={() => setScreen(n.id)}
            className={
              "rounded-full px-4 py-2 text-sm font-semibold " +
              (screen === n.id || (n.id === "home" && screen === "plan")
                ? "bg-leafdark text-white"
                : "bg-white text-stone-600 border border-stone-200")
            }
          >
            {n.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-2xl px-4 pb-16 pt-2">
        {screen === "home" && (
          <div className="space-y-5">
            <div className="rounded-3xl bg-leafdark p-6 text-white sm:p-8">
              <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{t("hero_title", lang)}</h1>
              <p className="mt-3 text-white/80 leading-relaxed">{t("hero_sub", lang)}</p>
              <button
                onClick={() => analyze(DEMO_BILL, DEMO_HOME)}
                disabled={busy}
                className="mt-5 rounded-2xl bg-amberwarm px-6 py-3.5 text-lg font-semibold text-white disabled:opacity-50"
              >
                {busy ? t("loading", lang) : t("btn_demo", lang)}
              </button>
              <p className="mt-2 text-xs text-white/60">{t("demo_note", lang)}</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: "upload", label: t("tab_upload", lang) },
                { id: "manual", label: t("tab_manual", lang) },
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className={
                    "flex-1 rounded-2xl px-4 py-3 font-semibold " +
                    (tab === tb.id ? "bg-white shadow border border-stone-200" : "text-stone-500")
                  }
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {tab === "upload" ? (
              <UploadBill lang={lang} onAnalyze={analyze} busy={busy} error={error} />
            ) : (
              <ManualEntry lang={lang} onAnalyze={analyze} busy={busy} error={error} />
            )}
          </div>
        )}

        {screen === "plan" && planData && (
          <PlanView lang={lang} data={planData} onNew={() => setScreen("home")} />
        )}

        {screen === "dashboard" && <Dashboard lang={lang} onOpen={openPlan} />}
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400 px-4">
        {t("footer", lang)}
      </footer>
    </div>
  );
}
