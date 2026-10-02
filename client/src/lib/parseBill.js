// parseBill.js
// Reads the raw text that tesseract.js pulls out of a bill photo and
// picks out the numbers we need. Indian discom bills print lines like:
//   ENERGY CHRG      507.00
//   FIXED CHRG        10.00
//   NET BILL         671.00
// Commas are stripped first ("1,234.00" -> "1234.00").
// Everything is optional: missing fields come back null and the user
// corrects them on the confirmation screen.

function stripCommas(text) {
  return text.replace(/,/g, "");
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

export function parseBillText(rawText) {
  const text = stripCommas(rawText || "");

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
      /AMT\s*(?:BEFR|BEFORE|BEF|BFR)\s*DUE\s*D[TA][\s\S]*?(\d{3,}\.\d{1,2})/i,
      /TOTAL\s*AMT\s*PAYABLE[\s\S]*?(\d{3,}\.\d{1,2})/i,
    ]);
    return { netBill, energyCharge: null, fixedCharges: null, unitsKwh: null };
  }

  const netBill = findAmount(text, [
    /NET\s*BILL[^\d]*?(\d+\.\d{1,2})/i,
    /NET\s*AMOUNT[^\d]*?(\d+\.\d{1,2})/i,
    /BILL\s*AFT\s*SUB[^\d]*?(\d+\.\d{1,2})/i,
    /TOTAL\s*AMT\s*PAYABLE[^\d]*?(\d+\.\d{1,2})/i,
  ]);

  const energyCharge = findAmount(text, [
    /ENERGY\s*CHRG[^\d]*?(\d+\.\d{1,2})/i,
    /ENERGY\s*CHARGE[^\d]*?(\d+\.\d{1,2})/i,
  ]);

  // Fixed side of the bill: fixed charge, customer charge, electricity
  // duty, true-up and fuel surcharges. Each is optional; we add up
  // whatever the OCR managed to read.
  const fixedParts = [
    findAmount(text, [/FIXED\s*CHRG[^\d]*?(\d+\.\d{1,2})/i, /FIXED\s*CHARGE[^\d]*?(\d+\.\d{1,2})/i]),
    findAmount(text, [/CUST\s*CHRG[^\d]*?(\d+\.\d{1,2})/i]),
    findAmount(text, [/^ED\s+(\d+\.\d{1,2})/im]),
    findAmount(text, [/TRUEUP\s*CHRG[^\d]*?(\d+\.\d{1,2})/i]),
    findAmount(text, [/FPPCA\s*CHRG[^\d]*?(\d+\.\d{1,2})/i]),
    findAmount(text, [/FPPCA2\s*CHRG[^\d]*?(\d+\.\d{1,2})/i]),
  ].filter((v) => v !== null);
  const fixedCharges = fixedParts.length ? Math.round(fixedParts.reduce((a, b) => a + b, 0) * 100) / 100 : null;

  const unitsKwh = findAmount(text, [
    /TOTAL\s*UNIT[^\d]*?(\d+\.?\d*)/i,
    /UNITS?\s*(?:CONSUMED)?[^\d]*?(\d+\.?\d*)/i,
    /KWH[^\d]*?(\d+\.?\d*)/i,
  ]);

  return { netBill, energyCharge, fixedCharges, unitsKwh };
}
