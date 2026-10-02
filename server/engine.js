// engine.js
// The rule-based savings engine for Indian households.
// It turns bill numbers into an appliance-level savings plan.
// Every number here is a documented estimate, not a measurement.
// The frontend shows the assumptions list so nothing is hidden.

const CO2_PER_KWH = 0.82; // kg of CO2 per kWh, India grid average (Central Electricity Authority)
const DEFAULT_RATE = 6.5; // Rs per kWh, typical urban slab when units are not printed on the bill
const WASTE_CAP = 0.2; // we never claim more than 20% of the energy charge as avoidable waste

function num(v, fallback = 0) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// bill: { netBill, energyCharge, fixedCharges, unitsKwh }
// home: { type, fans, fansOld, acCount, fridgeOld, bulbs }
// Returns a plan object with stable keys. The frontend translates every key,
// so the plan itself stays language-neutral.
function analyzeBill(bill, home = {}) {
  const netBill = num(bill.netBill);
  const energyCharge = num(bill.energyCharge) || round2(netBill * 0.75);
  const fixedCharges = num(bill.fixedCharges) || round2(Math.max(0, netBill - energyCharge));

  // Unit rate: from the bill when units are given, otherwise a stated estimate.
  let units = num(bill.unitsKwh);
  let rate;
  let rateEstimated = false;
  if (units > 0) {
    rate = round2(energyCharge / units);
  } else {
    rate = DEFAULT_RATE;
    rateEstimated = true;
    units = round2(energyCharge / rate);
  }

  const h = {
    fans: num(home.fans, 4),
    fansOld: home.fansOld !== false, // default: old fans, the common case
    acCount: num(home.acCount, 1),
    fridgeOld: home.fridgeOld === true,
    bulbs: num(home.bulbs, 5),
  };

  const items = [];

  // Old ceiling fan: 75W. 5-star fan: 28W. 8 hours a day.
  if (h.fansOld && h.fans > 0) {
    const n = Math.min(Math.round(h.fans), 4);
    const kwh = round2(((75 - 28) * 8 * 30 * n) / 1000);
    items.push({
      key: "bd_fans",
      monthlyKwh: kwh,
      monthlyRs: round2(kwh * rate),
      tip: { key: "tip_fans", params: { n, rs: Math.round(kwh * rate) } },
    });
  }

  // Old bulb/tube: 60W. LED: 9W. 5 hours a day.
  if (h.bulbs > 0) {
    const n = Math.min(Math.round(h.bulbs), 10);
    const kwh = round2(((60 - 9) * 5 * 30 * n) / 1000);
    items.push({
      key: "bd_lights",
      monthlyKwh: kwh,
      monthlyRs: round2(kwh * rate),
      tip: { key: "tip_lights", params: { n, rs: Math.round(kwh * rate) } },
    });
  }

  // Old fridge (8+ years) uses roughly 45 kWh/month more than a 5-star one.
  if (h.fridgeOld) {
    const kwh = 45;
    items.push({
      key: "bd_fridge",
      monthlyKwh: kwh,
      monthlyRs: round2(kwh * rate),
      tip: { key: "tip_fridge", params: { rs: Math.round(kwh * rate) } },
    });
  }

  // AC: assume it is about 35% of the energy charge in cooling months.
  // Running it at 25C instead of 20C cuts its use by roughly 18%.
  if (h.acCount > 0) {
    const share = Math.min(h.acCount, 2) * 0.35;
    const monthlyRs = round2(energyCharge * share * 0.18);
    items.push({
      key: "bd_ac",
      monthlyKwh: round2(monthlyRs / rate),
      monthlyRs,
      tip: { key: "tip_ac", params: { rs: Math.round(monthlyRs) } },
    });
  }

  // Standby loads (TV, set-top box, chargers left plugged in): about 5% of the bill.
  {
    const monthlyRs = round2(energyCharge * 0.05);
    items.push({
      key: "bd_standby",
      monthlyKwh: round2(monthlyRs / rate),
      monthlyRs,
      tip: { key: "tip_standby", params: { rs: Math.round(monthlyRs) } },
    });
  }

  // Shifting heavy appliances (washing machine, geyser) to off-peak hours.
  // Conservative: about 3% of the energy charge where time-of-day rates apply.
  {
    const monthlyRs = round2(energyCharge * 0.03);
    items.push({
      key: "bd_shift",
      monthlyKwh: round2(monthlyRs / rate),
      monthlyRs,
      tip: { key: "tip_shift", params: { rs: Math.round(monthlyRs) } },
    });
  }

  // Cap the total so the plan never promises more than 20% of the energy charge.
  let totalRs = items.reduce((s, i) => s + i.monthlyRs, 0);
  const cap = energyCharge * WASTE_CAP;
  if (totalRs > cap && totalRs > 0) {
    const f = cap / totalRs;
    for (const i of items) {
      i.monthlyRs = round2(i.monthlyRs * f);
      i.monthlyKwh = round2(i.monthlyKwh * f);
      if (i.tip && i.tip.params.rs) i.tip.params.rs = Math.round(i.tip.params.rs * f);
    }
    totalRs = round2(items.reduce((s, i) => s + i.monthlyRs, 0));
  }

  const wasteMonthlyRs = round2(totalRs);
  const wasteYearlyRs = Math.round(wasteMonthlyRs * 12);
  const totalMonthlyKwh = round2(items.reduce((s, i) => s + i.monthlyKwh, 0));
  const co2YearlyKg = Math.round(totalMonthlyKwh * 12 * CO2_PER_KWH);

  // The 4-week checklist. Keys are stable; the frontend translates them.
  const checklist = [
    { key: "cl_w1_1", week: 1 }, { key: "cl_w1_2", week: 1 }, { key: "cl_w1_3", week: 1 },
    { key: "cl_w2_1", week: 2 }, { key: "cl_w2_2", week: 2 }, { key: "cl_w2_3", week: 2 },
    { key: "cl_w3_1", week: 3 }, { key: "cl_w3_2", week: 3 }, { key: "cl_w3_3", week: 3 },
    { key: "cl_w4_1", week: 4 }, { key: "cl_w4_2", week: 4 }, { key: "cl_w4_3", week: 4 },
  ];

  const assumptions = [
    rateEstimated
      ? { key: "asm_rate_est", params: { r: rate } }
      : { key: "asm_rate_given", params: { r: rate } },
    { key: "asm_co2", params: {} },
    { key: "asm_cap", params: {} },
  ];

  return {
    bill: { netBill, energyCharge, fixedCharges, unitsKwh: units, ratePerUnit: rate, rateEstimated },
    home: h,
    wasteMonthlyRs,
    wasteYearlyRs,
    wasteMonthlyKwh: totalMonthlyKwh,
    co2YearlyKg,
    breakdown: items,
    tips: items.map((i) => i.tip),
    checklist,
    assumptions,
    ai: null, // filled by gemini.js when a key is present
  };
}

module.exports = { analyzeBill, CO2_PER_KWH, DEFAULT_RATE };
