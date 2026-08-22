# 🚀 Free Deployment Guide — DayFlow HRMS

## Stack (100% Free, No Credit Card Needed)

| Part | Platform | Cost |
|---|---|---|
| Frontend (Angular) | [Vercel](https://vercel.com) | Free forever |
| Backend (Spring Boot) | [Render](https://render.com) | Free (sleeps after 15min idle) |
| Database (PostgreSQL) | [Neon.tech](https://neon.tech) | Free forever |

---

## Step 1 — Set Up Free Database on Neon.tech

1. Go to **https://neon.tech** → Click **"Sign Up"** (use GitHub)
2. Click **"Create Project"** → Name it `dayflow`
3. Choose region closest to you → Click **"Create Project"**
4. On the dashboard, click **"Connection Details"**
5. Copy these 3 values — you'll need them later:

```
Host:     ep-xxxxxx.region.aws.neon.tech
Database: neondb
Username: neondb_owner
Password: xxxxxxxxxxxxxxx
```

Your JDBC URL will be:
```
jdbc:postgresql://ep-xxxxxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## Step 2 — Deploy Backend on Render

1. Go to **https://render.com** → Sign in with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Connect your repo `keerthika01275/Odoo--dayflow-hub`, branch `dayflow`
4. Render reads `render.yaml` → Click **"Apply"**
5. After the service is created, go to the service → **"Environment"** tab
6. Set these environment variables using your Neon values:

| Variable | Value |
|---|---|
| `DB_URL` | `jdbc:postgresql://YOUR_NEON_HOST/neondb?sslmode=require` |
| `DB_USERNAME` | Your Neon username |
| `DB_PASSWORD` | Your Neon password |
| `ALLOWED_ORIGINS` | (set after Vercel deploy — see Step 4) |

7. Click **"Save Changes"** → Render will build & deploy (~5-10 min first time)
8. Your backend URL: `https://dayflow-backend.onrender.com`

---

## Step 3 — Update Frontend API URL

Open `frontend/src/environments/environment.prod.ts` and replace the URL:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://dayflow-backend.onrender.com'  // ← your Render URL
};
```

Commit and push:
```
git add frontend/src/environments/environment.prod.ts
git commit -m "fix: set render backend URL"
git push origin dayflow
```

---

## Step 4 — Deploy Frontend on Vercel

1. Go to **https://vercel.com** → Sign in with GitHub
2. Click **"Add New Project"** → Import `keerthika01275/Odoo--dayflow-hub`
3. Set **Root Directory** = `frontend`
4. Set **Branch** = `dayflow`
5. Click **"Deploy"**
6. Your frontend URL: `https://dayflow-xxxx.vercel.app`

---

## Step 5 — Set CORS (Connect Frontend ↔ Backend)

Go back to **Render** → your `dayflow-backend` service → **Environment** tab:

| Variable | Value |
|---|---|
| `ALLOWED_ORIGINS` | `https://dayflow-xxxx.vercel.app` |

Click **Save Changes** — Render auto-redeploys.

---

## ✅ You're Live!

| Service | URL |
|---|---|
| Frontend | `https://dayflow-xxxx.vercel.app` |
| Backend | `https://dayflow-backend.onrender.com` |
| Database | Neon.tech dashboard |

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@dayflow.com | Admin@123 |
| HR | priya@dayflow.com | Priya@123 |
| Employee | rahul@dayflow.com | Rahul@123 |

---

## ⚠️ Important Notes

- **Render free tier** sleeps after 15 min of inactivity. First request = ~30s wake-up time.
- **Neon free tier** — 0.5 GB storage, always free, never expires.
- **Vercel** — Always free for hobby projects.
- Local development still uses H2 file DB — no changes needed locally.
