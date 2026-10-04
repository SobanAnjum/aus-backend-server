# A u.S Wirtschaftsberatung e.K. - Backend API & Real-Time Server

Production-ready backend API and real-time communication server for **A u.S Wirtschaftsberatung e.K.** Built with Node.js, Express, TypeScript, and WebSockets.

---

## 🌟 Key Features

- **RESTful Endpoints:** Appointments management, advisor schedules, client registry, and authentication.
- **Bi-directional WebSockets (`ws`):** Real-time chat synchronization between clients and admins with room isolation by client email.
- **SSE Fallback:** Server-Sent Events stream (`/api/chat/stream`) for environments or firewalls that restrict WebSockets.
- **Automated Email Notifications:** Resend integration for appointment booking confirmations and admin alerts.
- **Database Engine:** PostgreSQL adapter with resilient fallback for zero-downtime operation.
- **CORS Configured:** Secure cross-origin resource sharing tailored for frontend apps hosted on Vercel or custom domains.
- **Docker Ready:** Multi-stage production Dockerfile included for deployment on any container platform.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (>= 20.0.0)
- **Framework:** Express + TypeScript
- **Bundler:** esbuild
- **Real-time Engine:** `ws` (WebSockets) + SSE
- **Emails:** Resend API
- **Database:** PostgreSQL (`pg`)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
DATABASE_URL=postgres://user:password@host:5432/dbname
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM="A u.S Beratung <onboarding@resend.dev>"
ADMIN_NOTIFICATION_EMAIL=admin@aus-beratung.de
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build & Start Production Server
```bash
npm run build
npm start
```

---

## ☁️ Free Backend Hosting (Does NOT Sleep / Pause)

### Recommended: Koyeb (Free Eco/Nano Instance)
Koyeb provides a free web service instance that **runs 24/7 and does NOT sleep after inactivity** (unlike Render's free tier which spins down after 15 minutes).

1. Create a free account at [koyeb.com](https://www.koyeb.com).
2. Click **"Create Service"** -> select **"GitHub"**.
3. Authorize GitHub and select your **`aus-backend-server`** repository.
4. Builder: Select **Docker** (it will automatically detect the included `Dockerfile`), or select **Node.js** with:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `5000` (or `3000`)
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `https://your-customer-portal.vercel.app,https://your-admin-portal.vercel.app`
   - `DATABASE_URL`: Your free Supabase or Neon PostgreSQL connection string
   - `RESEND_API_KEY`: Your Resend API key (optional)
   - `EMAIL_FROM`: `A u.S Beratung <onboarding@resend.dev>`
   - `ADMIN_NOTIFICATION_EMAIL`: `admin@aus-beratung.de`
6. Click **Deploy**. Koyeb will build the container and provide you a public HTTPS URL (e.g. `https://aus-backend-xxx.koyeb.app`).

### Alternative 1: Render with Free Keep-Alive
If you prefer Render:
1. Deploy as a Web Service on [Render](https://render.com).
2. Set up a free 5-minute health-check monitor at [cron-job.org](https://cron-job.org) or [uptimerobot.com](https://uptimerobot.com) pinging `https://your-server.onrender.com/api/health` so Render never sleeps.

### Alternative 2: Fly.io
Fly.io provides free resource allowances with continuous micro VMs and native WebSocket support. Deploy via `fly launch`.

---

## 📄 License
Private & Proprietary - A u.S Wirtschaftsberatung e.K.
