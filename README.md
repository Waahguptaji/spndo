# SPNDO – Personal Finance Tracker

SPNDO is a full-stack personal finance management application that helps users manage their finances efficiently by tracking transactions, budgets, goals, and reminders in one place.

---

## 🚀 Features

- 🔐 JWT-based authentication (login/register)
- 💰 Transaction management (CRUD)
- 📊 Budget tracking
- 🎯 Goal management
- ⏰ Reminder system
- 👤 User profile management with image upload
- 📈 Financial summary & aggregation

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Fastify
- Prisma ORM

### Database
- PostgreSQL (Neon)

### Infrastructure
- Frontend: Vercel
- Backend: DigitalOcean Droplet
- Reverse Proxy: Nginx
- Process Manager: PM2
- SSL: Let's Encrypt (Certbot)

---

## 🌐 Live URLs

- Frontend: https://spndo.app  
- Backend API: https://api.spndo.app  

---

## ⚙️ Environment Variables

### Backend (.env)

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=4000
```

### Frontend (.env)

```
NEXT_PUBLIC_API_URL=https://api.spndo.app
```

---

## 🛠️ Local Setup

### 1. Clone the repository

```
git clone <your-repo-url>
cd spndo
```

---

### 2. Backend Setup

```
cd server
npm install
npx prisma migrate dev
npm run dev
```

---

### 3. Frontend Setup

```
cd client
npm install
npm run dev
```

---

## 📦 Deployment

### Frontend (Vercel)
- Connected to GitHub
- Auto deploys on push to main branch

### Backend (DigitalOcean)

Build:
```
npm run build
```

Run:
```
node dist/index.js
```

Using PM2:
```
pm2 start dist/index.js --name spndo-api
pm2 save
pm2 startup
```

---

## 🌍 Nginx Configuration

Nginx is used for:
- HTTPS (SSL termination)
- Reverse proxy to backend (port 4000)
- Serving static uploaded files

---

## 📁 File Uploads

- Profile images are stored locally on the server
- Files are saved in `/uploads` directory
- Accessible via:

```
https://api.spndo.app/uploads/<filename>
```

---

## 🔐 Authentication

- JWT-based authentication
- Protected routes use Fastify `preHandler` middleware

---

## 📌 API Routes Overview

```
/auth         → login, register
/user         → profile info & update
/transactions → transaction CRUD
/categories   → category management
/budgets      → budget tracking
/goals        → goal management
/reminders    → reminders
/summary      → aggregated financial data
```

---

## 🧠 Key Concepts Implemented

- Reverse proxy with Nginx
- HTTPS setup using Certbot
- CORS handling across domains
- Multipart file uploads
- Production deployment with PM2
- Environment-based configuration

---

## ⚠️ Notes

- Images are stored locally (no cloud storage used)
- Suitable for MVP and small-scale usage
- Can be extended with S3/DigitalOcean Spaces for scalability

---

## 👨‍💻 Author

Sahil Gupta
