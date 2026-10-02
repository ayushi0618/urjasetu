// db.js
// Storage that works with or without MongoDB.
// If MONGODB_URI is set, plans live in MongoDB.
// Otherwise they live in a local JSON file (server/data/db.json).
// The rest of the app only sees these five functions.

const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "data", "db.json");

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------- JSON file store (the default) ----------

function readFileDb() {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data.plans)) return data;
  } catch (e) {
    // missing or broken file: start fresh
  }
  return { plans: [] };
}

function writeFileDb(data) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
}

const fileStore = {
  async savePlan(entry) {
    const db = readFileDb();
    entry.id = entry.id || makeId();
    entry.createdAt = entry.createdAt || new Date().toISOString();
    entry.checklist = entry.checklist || {};
    db.plans.unshift(entry);
    writeFileDb(db);
    return entry;
  },
  async listPlans() {
    return readFileDb().plans.map((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      netBill: p.bill?.netBill,
      wasteMonthlyRs: p.plan?.wasteMonthlyRs,
      wasteYearlyRs: p.plan?.wasteYearlyRs,
    }));
  },
  async getPlan(id) {
    return readFileDb().plans.find((p) => p.id === id) || null;
  },
  async setChecklist(id, key, done) {
    const db = readFileDb();
    const plan = db.plans.find((p) => p.id === id);
    if (!plan) return null;
    plan.checklist = plan.checklist || {};
    if (done) plan.checklist[key] = true;
    else delete plan.checklist[key];
    writeFileDb(db);
    return plan.checklist;
  },
  async stats() {
    const plans = readFileDb().plans;
    let done = 0;
    let total = 0;
    for (const p of plans) {
      const keys = (p.plan?.checklist || []).map((c) => c.key);
      total += keys.length;
      for (const k of keys) if (p.checklist?.[k]) done += 1;
    }
    return {
      billsAnalyzed: plans.length,
      yearlySavingsRs: plans.reduce((s, p) => s + (p.plan?.wasteYearlyRs || 0), 0),
      co2YearlyKg: plans.reduce((s, p) => s + (p.plan?.co2YearlyKg || 0), 0),
      checklistDone: done,
      checklistTotal: total,
    };
  },
};

// ---------- MongoDB store (used when MONGODB_URI is set) ----------

let mongoColl = null;

async function getMongoColl() {
  if (mongoColl) return mongoColl;
  const { MongoClient } = require("mongodb");
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  mongoColl = client.db("urjasetu").collection("plans");
  return mongoColl;
}

const mongoStore = {
  async savePlan(entry) {
    const coll = await getMongoColl();
    entry.id = entry.id || makeId();
    entry.createdAt = entry.createdAt || new Date().toISOString();
    entry.checklist = entry.checklist || {};
    await coll.insertOne(entry);
    return entry;
  },
  async listPlans() {
    const coll = await getMongoColl();
    const docs = await coll.find({}).sort({ createdAt: -1 }).toArray();
    return docs.map((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      netBill: p.bill?.netBill,
      wasteMonthlyRs: p.plan?.wasteMonthlyRs,
      wasteYearlyRs: p.plan?.wasteYearlyRs,
    }));
  },
  async getPlan(id) {
    const coll = await getMongoColl();
    return (await coll.findOne({ id })) || null;
  },
  async setChecklist(id, key, done) {
    const coll = await getMongoColl();
    const field = `checklist.${key}`;
    if (done) await coll.updateOne({ id }, { $set: { [field]: true } });
    else await coll.updateOne({ id }, { $unset: { [field]: "" } });
    const doc = await coll.findOne({ id });
    return doc ? doc.checklist || {} : null;
  },
  async stats() {
    const coll = await getMongoColl();
    const plans = await coll.find({}).toArray();
    let done = 0;
    let total = 0;
    for (const p of plans) {
      const keys = (p.plan?.checklist || []).map((c) => c.key);
      total += keys.length;
      for (const k of keys) if (p.checklist?.[k]) done += 1;
    }
    return {
      billsAnalyzed: plans.length,
      yearlySavingsRs: plans.reduce((s, p) => s + (p.plan?.wasteYearlyRs || 0), 0),
      co2YearlyKg: plans.reduce((s, p) => s + (p.plan?.co2YearlyKg || 0), 0),
      checklistDone: done,
      checklistTotal: total,
    };
  },
};

function getStore() {
  if (process.env.MONGODB_URI) return { store: mongoStore, kind: "mongodb" };
  return { store: fileStore, kind: "json-file" };
}

module.exports = { getStore };
