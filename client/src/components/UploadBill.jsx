import { useRef, useState } from "react";
import { t } from "../i18n.js";
import { parseBillText } from "../lib/parseBill.js";

// Bill photo upload with in-browser OCR (tesseract.js).
// The photo never leaves the user's browser: tesseract runs locally,
// we only send the extracted numbers to our backend.
// Flow: pick file -> OCR -> show numbers for correction -> analyze.
export default function UploadBill({ lang, onAnalyze, busy, error }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fields, setFields] = useState(null);
  const [ocrError, setOcrError] = useState("");

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setOcrError("");
    setFields(null);
    setPreview(URL.createObjectURL(file));
    readBill(file);
  }

  async function readBill(file) {
    setReading(true);
    setProgress(0);
    try {
      // Dynamic import keeps the first page load light.
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", undefined, {
        logger: (m) => {
          if (m.status === "recognizing text" && m.progress) setProgress(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const parsed = parseBillText(data.text || "");
      if (parsed.netBill == null && parsed.energyCharge == null) {
        setOcrError(t("ocr_fail", lang));
      } else {
        setFields({
          netBill: parsed.netBill ?? "",
          energyCharge: parsed.energyCharge ?? "",
          fixedCharges: parsed.fixedCharges ?? "",
          unitsKwh: parsed.unitsKwh ?? "",
        });
      }
    } catch (e) {
      console.error("OCR failed:", e);
      setOcrError(t("ocr_fail", lang));
    } finally {
      setReading(false);
    }
  }

  function set(name, value) {
    setFields((f) => ({ ...f, [name]: value }));
  }

  function submit() {
    onAnalyze(
      {
        netBill: fields.netBill,
        energyCharge: fields.energyCharge,
        fixedCharges: fields.fixedCharges,
        unitsKwh: fields.unitsKwh,
      },
      null // home profile stays default; user can refine via manual entry
    );
  }

  const num = (name, label, icon) => (
    <label className="block rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3 transition focus-within:border-leaf focus-within:bg-white">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stone-500">
        <span>{icon}</span> {label}
      </span>
      <input
        type="number"
        min="0"
        step="any"
        value={fields[name]}
        onChange={(e) => set(name, e.target.value)}
        placeholder="0"
        className="focus-leaf stat-number mt-1 w-full bg-transparent text-2xl font-bold text-stone-900 placeholder:text-stone-300"
      />
    </label>
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={
          "group cursor-pointer rounded-[1.75rem] border-2 border-dashed p-8 text-center transition-all sm:p-10 " +
          (dragOver
            ? "border-leaf bg-leaf/5 shadow-glow scale-[1.01]"
            : "border-stone-300/80 bg-white shadow-card hover:border-leaf/60 hover:shadow-lift")
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf/15 to-amberwarm/15 text-3xl transition-transform group-hover:scale-110">
          📸
        </div>
        <p className="mt-3 text-lg font-extrabold tracking-tight text-stone-800">{t("drop_title", lang)}</p>
        <p className="mt-1 text-sm text-stone-500">
          {t("drop_or", lang)}{" "}
          <span className="font-bold text-leaf underline decoration-leaf/40 underline-offset-2">
            {t("browse", lang)}
          </span>
        </p>
        <p className="mx-auto mt-4 max-w-xs rounded-full bg-stone-100 px-4 py-1.5 text-xs font-medium text-stone-500">
          💡 {t("ocr_tip", lang)}
        </p>
      </div>

      {preview && (
        <div className="animate-fade-in mt-4 overflow-hidden rounded-[1.75rem] border border-stone-200/80 shadow-card">
          <img src={preview} alt="Bill" className="max-h-64 w-full bg-stone-100 object-contain" />
        </div>
      )}

      {reading && (
        <div className="animate-fade-in mt-4 rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf/10 text-xl animate-pulse-soft">
              🔍
            </span>
            <div className="flex-1">
              <p className="font-bold text-stone-800">{t("reading", lang)}</p>
              <p className="text-xs text-stone-400">{t("reading_note", lang)}</p>
            </div>
            <span className="stat-number text-lg font-extrabold text-leaf">{progress}%</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-100">
            <div className="bar-shimmer h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {ocrError && (
        <div className="animate-fade-in mt-4 flex items-start gap-3 rounded-[1.75rem] border border-red-200 bg-red-50 p-5">
          <span className="text-xl">😕</span>
          <div>
            <p className="font-bold text-red-800">{ocrError}</p>
            <button
              onClick={() => document.querySelector('[data-tab="manual"]')?.click()}
              className="mt-2 text-sm font-bold text-red-700 underline underline-offset-2"
            >
              {t("tab_manual", lang)} →
            </button>
          </div>
        </div>
      )}

      {fields && !reading && (
        <div className="animate-fade-up mt-4 rounded-[1.75rem] border border-stone-200/80 bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf/10 text-lg">✅</span>
            <p className="font-extrabold tracking-tight text-stone-800">{t("confirm_title", lang)}</p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {num("netBill", t("f_net", lang), "🧾")}
            {num("energyCharge", t("f_energy", lang), "⚡")}
            {num("fixedCharges", t("f_fixed", lang), "🏷️")}
            {num("unitsKwh", t("f_units", lang), "🔢")}
          </div>
          <button
            onClick={submit}
            disabled={busy}
            className="mt-5 w-full rounded-2xl bg-gradient-to-b from-leaf to-leafdark px-6 py-4 text-lg font-extrabold text-white shadow-lift transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {busy ? t("loading", lang) : <>✨ {t("btn_make_plan", lang)}</>}
          </button>
          {error && <p className="mt-3 text-center font-medium text-red-700">{t("err_analyze", lang)}</p>}
        </div>
      )}
    </div>
  );
}
