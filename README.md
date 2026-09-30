# 🎒 Karvaan — Tinder for Group Travel Budgeting

**Karvaan** is a travel matchmaking and group budgeting web application designed for adventurous travelers, trekkers, and backpackers to form vetted travel squads, split shared group kitties, and build trusted travel reputations through peer-reviewed **Vibe Scores** and community badges.

---

## ✨ Key Features

- 🃏 **Framer Motion Swipe Deck**: Intuitive card swiping (Right = *Join Request*, Left = *Pass*) with physical gesture rotation, dynamic *LIKE / PASS* stamps, and travel style filters.
- ⭐ **Dynamic Vibe Score & Badges**: 1-to-5 star aggregate rating system powered by mutual peer reviews and community badges (*"Punctual"*, *"Chill"*, *"Budget Maestro"*, *"Photographer"*, *"Navigation Pro"*, *"Party Starter"*, *"Safety First"*).
- 🧭 **Host Approval Command Center**: Trip leads review incoming join requests, inspect applicant vibe history, and approve travelers into the confirmed squad.
- 💰 **Group Kitty Budgeting**: Transparent per-head budget breakdown and total estimated kitty pool calculator.
- 💬 **Confirmed Squads & Group Chat**: Integrated live simulated squad coordination widget and member rosters.
- 🔄 **Multi-Persona Testing Switcher**: Instant profile switcher to seamlessly test both Host and Applicant perspectives (*Aarav*, *Rhea*, *Kabir*, *Ananya*, *Dev*, *Tanvi*).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Canvas Confetti.
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Automated Triggers, Auth).
- **Typography & Styling**: Plus Jakarta Sans, Outfit, True White card surfaces, and Soft Pearl canvas background.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Supabase Live Mode)
```bash
cp .env.example .env.local
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 One-Click Deployment

Deploy Karvaan instantly to **Vercel** with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSouvik-Das-23%2FKarvaan)

### Manual Deployment on Vercel:
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your repository: `Souvik-Das-23/Karvaan`.
3. Framework preset will automatically detect **Next.js**.
4. (Optional) Add environment variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 🗄️ Database Migrations

PostgreSQL schemas and seed datasets are located in:
- `supabase/migrations/20260930000001_init_schema.sql`
- `supabase/seed.sql`

---

## 📄 License
MIT License