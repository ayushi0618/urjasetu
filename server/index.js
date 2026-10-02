// index.js
// UrjaSetu backend. Small Express API:
//   POST /api/analyze            -> build a savings plan from bill + home data (and save it)
//   GET  /api/plans              -> list past analyses (newest first)
//   GET  /api/plans/:id          -> one full analysis with checklist state
//   POST /api/plans/:id/checklist { key, done } -> tick/untick a checklist item
//   GET  /api/dashboard          -> totals across everything saved
// In production it also serves the built frontend from ../client/dist.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { analyzeBill } = require("./engine");
const { enhanceWithGemini } = require("./gemini");
const { getStore } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const { store, kind } = getStore();
console.log(`UrjaSetu storage: ${kind}`);

// Build a plan, optionally enhance it with Gemini, then save it.
app.post("/api/analyze", async (req, res) => {
  try {
    const { bill = {}, home = {} } = req.body || {};
    if (!bill.netBill && !bill.energyCharge) {
      return res.status(400).json({ error: "Send at least a net bill amount or an energy charge." });
    }
    const plan = analyzeBill(bill, home);
    // AI is optional. If it fails or no key is set, plan.ai stays null
    // and the frontend shows the rule-based plan.
    const ai = await enhanceWithGemini(plan.bill, plan);
    if (ai) plan.ai = ai;
    const saved = await store.savePlan({ bill: plan.bill, home: plan.home, plan });
    res.json({ id: saved.id, plan, aiUsed: !!ai });
  } catch (e) {
    console.error("analyze failed:", e);
    res.status(500).json({ error: "Could not build the plan. Please try again." });
  }
});

app.get("/api/plans", async (req, res) => {
  try {
    res.json(await store.listPlans());
  } catch (e) {
    console.error("list failed:", e);
    res.status(500).json({ error: "Could not load past analyses." });
  }
});

app.get("/api/plans/:id", async (req, res) => {
  try {
    const plan = await store.getPlan(req.params.id);
    if (!plan) return res.status(404).json({ error: "Not found." });
    res.json(plan);
  } catch (e) {
    console.error("get failed:", e);
    res.status(500).json({ error: "Could not load the analysis." });
  }
});

app.post("/api/plans/:id/checklist", async (req, res) => {
  try {
    const { key, done } = req.body || {};
    if (!key) return res.status(400).json({ error: "Checklist key is required." });
    const checklist = await store.setChecklist(req.params.id, key, !!done);
    if (!checklist) return res.status(404).json({ error: "Not found." });
    res.json({ checklist });
  } catch (e) {
    console.error("checklist failed:", e);
    res.status(500).json({ error: "Could not save the checklist." });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const stats = await store.stats();
    const pct =
      stats.checklistTotal > 0 ? Math.round((stats.checklistDone / stats.checklistTotal) * 100) : 0;
    res.json({ ...stats, checklistPct: pct });
  } catch (e) {
    console.error("dashboard failed:", e);
    res.status(500).json({ error: "Could not load the dashboard." });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true, storage: kind }));

// Serve the built frontend when it exists (after `npm run build`).
const dist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found." });
    res.sendFile(path.join(dist, "index.html"));
  });
  console.log("Serving frontend from client/dist");
}

app.listen(PORT, () => {
  console.log(`UrjaSetu server running at http://localhost:${PORT}`);
});
