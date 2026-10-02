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

  const num = (name, label) => (
    <label className="block">
      <span className="text-sm font-medium text-stone-600">{label}</span>
      <input
        type="number"
        min="0"
        step="any"
        value={fields[name]}
        onChange={(e) => set(name, e.target.value)}
        className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-lg outline-none focus:border-leaf"
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
          "cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition " +
          (dragOver ? "border-leaf bg-green-50" : "border-stone-300 bg-white")
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div className="text-4xl">🧾</div>
        <p className="mt-2 text-lg font-semibold">{t("drop_title", lang)}</p>
        <p className="text-sm text-stone-500">
          {t("drop_or", lang)} <span className="underline">{t("browse", lang)}</span>
        </p>
        <p className="mt-3 text-xs text-stone-400">{t("ocr_tip", lang)}</p>
      </div>

      {preview && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <img src={preview} alt="Bill" className="max-h-64 w-full object-contain bg-stone-100" />
        </div>
      )}

      {reading && (
        <div className="mt-4 rounded-2xl bg-white p-4 border border-stone-200">
          <p className="font-medium">{t("reading", lang)}</p>
          <div className="mt-2 h-2 rounded-full bg-stone-100">
            <div className="h-2 rounded-full bg-leaf transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-stone-400">{t("reading_note", lang)}</p>
        </div>
      )}

      {ocrError && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-red-700">{ocrError}</p>}

      {fields && !reading && (
        <div className="mt-4 rounded-2xl bg-white p-5 border border-stone-200">
          <p className="mb-4 font-semibold">{t("confirm_title", lang)}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {num("netBill", t("f_net", lang))}
            {num("energyCharge", t("f_energy", lang))}
            {num("fixedCharges", t("f_fixed", lang))}
            {num("unitsKwh", t("f_units", lang))}
          </div>
          <button
            onClick={submit}
            disabled={busy}
            className="mt-5 w-full rounded-2xl bg-leaf px-6 py-4 text-lg font-semibold text-white disabled:opacity-50"
          >
            {busy ? t("loading", lang) : t("btn_make_plan", lang)}
          </button>
          {error && <p className="mt-3 text-red-700">{t("err_analyze", lang)}</p>}
        </div>
      )}
    </div>
  );
}
