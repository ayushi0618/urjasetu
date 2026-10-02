// parseBill.js
// Reads the raw text that tesseract.js pulls out of a bill photo and
// picks out the numbers we need.
//
// Indian discom bills vary a lot by state (UPPCL, BSES, BESCOM, MSEDCL,
// TANGEDCO, NBPDCL, ...), so instead of matching one layout we match a
// wide set of label wordings for each field:
//
//   net bill      - "NET PAYABLE", "BILL AMOUNT", "AMOUNT PAYABLE", ...
//   energy charge - "ENERGY CHARGES", "CONSUMPTION CHARGES", ...
//   fixed side    - "FIXED CHARGE", "DEMAND CHARGE", "METER RENT",
//                   "ELECTRICITY DUTY", "FUEL SURCHARGE", ...
//   units         - "UNITS CONSUMED", "BILLED UNITS", "TOTAL UNIT", ...
//
// If no label is recognized at all, we fall back to the largest decimal
// amount printed on the bill: the net payable is almost always the
// biggest number on the page.
//
// Commas are stripped first ("1,234.00" -> "1234.00") and stray table
// borders ("|") that tesseract invents are removed.
// Everything is optional: missing fields come back null and the user
// corrects them on the confirmation screen.

function clean(text) {
  // Tesseract often turns table borders into "|" characters. Pad them with
  // spaces so they stay visible as separators (deleting them would glue
  // "1392.53 | UNITS" into "1392.53 UNITS" and confuse the units matcher).
  return (text || "").replace(/,/g, "").replace(/\s*[|¦]\s*/g, " | ");
}

// Try each pattern in order; return the first number that parses.
function findAmount(text, patterns) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const v = parseFloat(m[1]);
      if (Number.isFinite(v)) return Math.round(v * 100) / 100;
    }
  }
  return null;
}

// Largest decimal amount anywhere in the text. Dates (01/08/2024) and
// plain meter readings (14063) have no decimal point, so they never win.
function largestAmount(text) {
  let best = null;
  const re = /(\d+\.\d{1,2})/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const v = parseFloat(m[1]);
    if (Number.isFinite(v) && (best === null || v > best)) best = v;
  }
  return best === null ? null : Math.round(best * 100) / 100;
}

// "Rs. 1,234.00" style prefixes are noise; the number is what matters.
const AMT = "(\\d+\\.\\d{1,2})";

export function parseBillText(rawText) {
  const text = clean(rawText);

  // Bihar (NBPDCL/SBPDCL) style bills look like this:
  //   Bill Due Dt | Amt befr Due Dt (With Rebate) | Amt after Due Dt (Without Rebate)
  //   01/08/2024  | 11196.00                      | 11298.00
  //   ...
  //   Total Amt Payable at a time within 01/08/2024 : 33234.00
  // The first column is the monthly amount with rebate, which is what the
  // savings plan needs. "Total Unit" on these bills covers the whole
  // multi-month reading period, so units are left blank on purpose: the
  // engine estimates the rate instead of mixing a monthly bill with
  // multi-month units.
  const nbpdcl = /AMT\s*(?:BEFR|BEFORE|BEF|BFR)\s*DUE\s*D[TA]/i.test(text);
  if (nbpdcl) {
    const netBill = findAmount(text, [
      new RegExp("AMT\\s*(?:BEFR|BEFORE|BEF|BFR)\\s*DUE\\s*D[TA][\\s\\S]*?(\\d{3,}\\.\\d{1,2})", "i"),
      new RegExp("TOTAL\\s*AMT\\s*PAYABLE[\\s\\S]*?" + AMT, "i"),
    ]);
    return { netBill, energyCharge: null, fixedCharges: null, unitsKwh: null };
  }

  // Net bill: most specific labels first so "TOTAL BILL AMOUNT" wins
  // over the generic "BILL AMOUNT" inside it.
  let netBill = findAmount(text, [
    new RegExp("NET\\s*(?:BILL|PAYABLE|AMOUNT|AMT)[^\\d]*?" + AMT, "i"),
    new RegExp("BILL\\s*AFT\\s*SUB[^\\d]*?" + AMT, "i"),
    new RegExp("(?:TOTAL|NET)\\s+(?:AMT|AMOUNT)\\s+PAYABLE[^\\d]*?" + AMT, "i"),
    new RegExp("AMOUNT\\s+PAYABLE[^\\d]*?" + AMT, "i"),
    new RegExp("PAYABLE\\s+(?:AMOUNT|AMT)[^\\d]*?" + AMT, "i"),
    new RegExp("CURRENT\\s+BILL\\s+(?:AMOUNT|AMT)[^\\d]*?" + AMT, "i"),
    new RegExp("TOTAL\\s+BILL\\s+(?:AMOUNT|AMT)[^\\d]*?" + AMT, "i"),
    new RegExp("BILL\\s+(?:AMOUNT|AMT)[^\\d]*?" + AMT, "i"),
    new RegExp("GRAND\\s+TOTAL[^\\d]*?" + AMT, "i"),
    new RegExp("AMOUNT\\s+(?:TO\\s+BE\\s+)?PAID[^\\d]*?" + AMT, "i"),
    new RegExp("TOTAL\\s+DUE[^\\d]*?" + AMT, "i"),
    new RegExp("AMOUNT\\s+DUE[^\\d]*?" + AMT, "i"),
    new RegExp("TOTAL\\s+(?:AMT|AMOUNT)[^\\d]*?" + AMT, "i"),
  ]);
  // Last resort: the biggest number on the bill is usually what you pay.
  if (netBill === null) netBill = largestAmount(text);

  const energyCharge = findAmount(text, [
    new RegExp("ENERGY\\s*(?:CHARGES?|CHRG)[^\\d]*?" + AMT, "i"),
    new RegExp("CONSUMPTION\\s+CHARGES?[^\\d]*?" + AMT, "i"),
    new RegExp("UNIT\\s+CHARGES?[^\\d]*?" + AMT, "i"),
    new RegExp("POWER\\s+CHARGES?[^\\d]*?" + AMT, "i"),
  ]);

  // Fixed side of the bill: fixed/demand/customer charges, meter rent,
  // electricity duty, true-up and fuel surcharges. Each is optional; we
  // add up whatever the OCR managed to read.
  const fixedParts = [
    findAmount(text, [
      new RegExp("FIXED\\s*(?:CHARGES?|CHRG)[^\\d]*?" + AMT, "i"),
      new RegExp("DEMAND\\s+CHARGES?[^\\d]*?" + AMT, "i"),
    ]),
    findAmount(text, [new RegExp("METER\\s+RENT[^\\d]*?" + AMT, "i")]),
    findAmount(text, [
      new RegExp("CUSTOMER\\s+CHARGES?[^\\d]*?" + AMT, "i"),
      new RegExp("CUST\\s*CHRG[^\\d]*?" + AMT, "i"),
    ]),
    findAmount(text, [
      new RegExp("SERVICE\\s+CHARGES?[^\\d]*?" + AMT, "i"),
      new RegExp("FUEL\\s+SURCHO?ARGE[^\\d]*?" + AMT, "i"),
      new RegExp("FPPCA2?\\s*(?:CHRG|CHARGES?)?[^\\d]*?" + AMT, "i"),
      new RegExp("TRUEUP\\s*(?:CHRG|CHARGES?)?[^\\d]*?" + AMT, "i"),
    ]),
    findAmount(text, [
      new RegExp("ELECTRICITY\\s+DUTY[^\\d]*?" + AMT, "i"),
      new RegExp("^ED\\s+" + AMT, "im"),
    ]),
  ].filter((v) => v !== null);
  const fixedCharges = fixedParts.length
    ? Math.round(fixedParts.reduce((a, b) => a + b, 0) * 100) / 100
    : null;

  const unitsKwh = findAmount(text, [
    new RegExp("TOTAL\\s*UNIT[^\\d]*?(\\d+\\.?\\d*)", "i"),
    // The number can sit on either side of the word: "457 units" or "UNITS CONSUMED 210".
    /(\d+\.?\d*)\s*UNITS?/i,
    new RegExp("UNITS?\\s+CONSUMED[^\\d]*?(\\d+\\.?\\d*)", "i"),
    new RegExp("BILLED\\s+UNITS?[^\\d]*?(\\d+\\.?\\d*)", "i"),
    new RegExp("METERED\\s+UNITS?[^\\d]*?(\\d+\\.?\\d*)", "i"),
    /(\d+\.?\d*)\s*KWH/i,
    new RegExp("KWH[^\\d]*?(\\d+\\.?\\d*)", "i"),
  ]);

  return { netBill, energyCharge, fixedCharges, unitsKwh };
}
