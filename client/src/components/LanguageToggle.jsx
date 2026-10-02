import { LANGS } from "../i18n.js";

// Small pill switcher for English / Hindi / Hinglish.
export default function LanguageToggle({ lang, setLang }) {
  return (
    <div className="flex rounded-full bg-amber-100 p-1 text-sm">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={
            "rounded-full px-3 py-1.5 font-medium transition " +
            (lang === l.code ? "bg-white shadow text-stone-900" : "text-stone-600")
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
