# UrjaSetu

**Your bill, turned into a savings plan.**

UrjaSetu is an AI energy coach for Indian homes and small businesses. Photograph your electricity bill (or type in the numbers), and it builds you a personalized savings plan in rupees, with a week-by-week checklist. Built for the Yuva Yodha Energy Tech Hackathon by Schneider Electric.

## How it works

1. **Bill in** — Upload a photo of your electricity bill. The app reads it in your browser with OCR (tesseract.js) and shows the numbers for you to confirm. Or type them in manually.
2. **Plan out** — The savings engine estimates where your money goes (fans, lights, fridge, AC, standby devices, off-peak shifting) using Indian household data, and gives rupee savings for each. If you set a Gemini API key, the AI adds a warm summary and extra tips. The maths always stays ours.
3. **Track it** — A 4-week checklist and a dashboard show your progress: bills analyzed, estimated yearly savings, CO2 avoided.

## Tech

- Frontend: React 18 + Vite + Tailwind (mobile-first, English / Hindi / Hinglish)
- Backend: Node.js + Express
- Storage: MongoDB if you set `MONGODB_URI`, otherwise a local JSON file. No setup needed.
- AI: Google Gemini if you set `GEMINI_API_KEY`, otherwise the built-in rule engine.
- OCR: tesseract.js, runs fully in the browser. The photo never leaves the user's device.

## Run it locally

You need Node.js 18 or newer.

```bash
# 1. Install everything
npm run install:all

# 2. (optional) copy env and fill in what you have
cp .env.example .env

# 3. Start the backend (terminal 1)
npm run dev:server
# -> http://localhost:5000

# 4. Start the frontend (terminal 2)
npm run dev:client
# -> http://localhost:5173
```

Open http://localhost:5173 and click **"Try the 90-second demo"**.

### One-command demo build

```bash
npm run build   # builds the frontend into client/dist
npm start       # serves frontend + API from one port: http://localhost:5000
```

### Environment variables (all optional)

| Variable       | What it does                                              |
| -------------- | --------------------------------------------------------- |
| `PORT`         | Backend port (default 5000)                               |
| `MONGODB_URI`  | MongoDB connection string. Empty = local JSON file store. |
| `GEMINI_API_KEY` | Google Gemini key. Empty = rule-based plans only.       |
| `GEMINI_MODEL` | Gemini model name (default `gemini-2.0-flash`)            |

## Project layout

```
urjasetu/
  client/src/
    App.jsx                  # screens: home, plan, dashboard
    i18n.js                  # English / Hindi / Hinglish dictionary
    api.js                   # backend calls
    lib/parseBill.js         # OCR text -> bill numbers
    components/
      UploadBill.jsx         # drag-drop upload + tesseract OCR + confirm screen
      ManualEntry.jsx        # typed bill + home profile form
      PlanView.jsx           # savings plan, breakdown, checklist
      Dashboard.jsx          # totals + past analyses
      LanguageToggle.jsx     # EN / HI / Hinglish switcher
  server/
    index.js                 # Express API + serves the built frontend
    engine.js                # rule-based savings engine (documented estimates)
    gemini.js                # optional AI summary layer
    db.js                    # MongoDB-or-JSON storage
```

## The 90-second demo script (for judges)

**0:00 - 0:10 — The idea in one line.**
"This is UrjaSetu. You photograph your electricity bill, and it tells you where your money is going and what to do about it, in rupees."

**0:10 - 0:25 — One click.**
Click **"Try the 90-second demo"**. "This uses a real bill from a home in Ghaziabad: Rs. 671."

**0:25 - 0:50 — The plan.**
"Out of Rs. 671, Rs. 507 is the actual energy charge. We estimate about Rs. 100 a month is avoidable waste." Scroll the breakdown bars: fans, lights, fridge, AC, standby, off-peak. "Every number shows its assumption. Nothing is hidden."

**0:50 - 1:10 — The checklist.**
Open the 4-week checklist. Tick one item. "It saves to the backend, and the dashboard counts it." Switch the language to Hindi or Hinglish: "The whole app, including the checklist, speaks three languages."

**1:10 - 1:30 — The dashboard.**
Open the dashboard. "Rs. 1,217 estimated yearly savings from one bill, CO2 avoided, checklist progress. Now imagine this for a million homes."

## Notes for the team

- The rupee figures are estimates from documented household assumptions (see `server/engine.js` and the assumptions box in the app). Say that out loud if a judge asks. Honest numbers beat big numbers.
- First OCR run needs internet once to download the reader. After that it works offline.
- To explain the code in a review: `engine.js` is the maths, `parseBill.js` is the OCR reading, `db.js` picks MongoDB or a JSON file, `App.jsx` switches between the three screens.
