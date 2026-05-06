# 💼 JobMatch — Career Performance Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application for job matching and career performance tracking. JobMatch uses AI-powered matching to connect your skills, interests, and performance to the best career opportunities.

**🚀 Ready for Vercel Deployment** — This project is configured for easy deployment to Vercel with serverless API functions.

---

## 🚀 Features

- **User Authentication** — Register, login, and JWT-based session management
- **Dashboard** — Overview of match scores, job recommendations, and performance analytics
- **Job Matching** — AI-powered job matching with detailed match breakdowns
- **Find Jobs** — Search, filter, and browse job listings with match percentages
- **Job Performance** — Track career progress with interactive charts and skill analysis
- **Resume Upload** — Drag & drop resume upload with file validation
- **Interactive Charts** — Radar, Line, and Pie charts powered by Recharts

---

## 🛠️ Tech Stack

| Layer      | Technology                                           |
|------------|------------------------------------------------------|
| Frontend   | React 18, React Router v6, Axios, Recharts, Tailwind CSS v4 |
| Backend    | Node.js, Express.js, Mongoose, JWT, bcrypt, Multer   |
| Database   | MongoDB                                              |
| Styling    | Tailwind CSS v4, Google Fonts (Sora + DM Sans)       |

---

## 📁 Project Structure

```
jobmatch/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (name, email, skills, resume, etc.)
│   │   └── Job.js            # Job schema (title, company, matchPercent, etc.)
│   ├── routes/
│   │   ├── auth.js           # Register, Login, Get current user
│   │   ├── jobs.js           # List jobs, Get job details with match breakdown
│   │   └── profile.js        # Get/update profile, Upload resume
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── uploads/              # Uploaded resumes stored here
│   ├── seed.js               # Seed 10 jobs to MongoDB
│   ├── server.js             # Express server entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx     # Top navigation bar
    │   │   └── Sidebar.jsx    # Left sidebar navigation
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Main dashboard with stats & charts
    │   │   ├── JobMatch.jsx       # Job matching landing page
    │   │   ├── JobPerformance.jsx # Performance analytics & feedback
    │   │   ├── FindJobs.jsx       # Job search with filters & detail view
    │   │   ├── UploadResume.jsx   # Resume upload with drag & drop
    │   │   ├── LoginPage.jsx      # Login form
    │   │   └── RegisterPage.jsx   # Registration form
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management (Context API)
    │   ├── App.jsx            # Routes & layout
    │   ├── main.jsx           # React entry point
    │   └── index.css          # Global styles & Tailwind config
    ├── index.html
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (running locally on port 27017) — [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

---

## 🏁 How to Run

### 1. Clone / Navigate to the project

```bash
cd jobmatch
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running locally. On Windows, you can start it via:

```bash
# If MongoDB is installed as a service, it should already be running.
# Otherwise, start mongod manually:
mongod
```

### 5. Seed the Database

This loads 10 sample job listings into MongoDB:

```bash
cd backend
node seed.js
```

You should see:
```
MongoDB connected for seeding...
Cleared existing jobs.
Successfully seeded 10 jobs!
Database connection closed.
```

### 6. Start the Backend Server

```bash
cd backend
node server.js
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
```

### 7. Start the Frontend Dev Server

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in ~700ms
➜  Local: http://localhost:5173/
```

### 8. Open in Browser

Go to **http://localhost:5173/** in your browser.

---

## 🔑 Test Login Credentials

A test account has been pre-created:

| Field    | Value               |
|----------|---------------------|
| Email    | `alex@jobmatch.com` |
| Password | `password123`       |

Or you can register a new account from the **Register** page.

---

## 🌐 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint    | Description            | Auth Required |
|--------|-------------|------------------------|:---:|
| POST   | `/register` | Create new account     | ❌ |
| POST   | `/login`    | Login & get JWT token  | ❌ |
| GET    | `/me`       | Get current user       | ✅ |

### Jobs (`/api/jobs`)
| Method | Endpoint | Description                          | Auth Required |
|--------|----------|--------------------------------------|:---:|
| GET    | `/`      | List all jobs (supports `?search=` & `?type=`) | ✅ |
| GET    | `/:id`   | Get job details with match breakdown | ✅ |

### Profile (`/api/profile`)
| Method | Endpoint          | Description              | Auth Required |
|--------|--------------------|--------------------------|:---:|
| GET    | `/`               | Get profile & performance | ✅ |
| PUT    | `/`               | Update name & skills      | ✅ |
| POST   | `/upload-resume`  | Save resume metadata      | ✅ |

---

## 🔧 Environment Variables

The local backend uses a `.env` file (`backend/.env`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobmatch
JWT_SECRET=jobmatch_secret_key
```

For Vercel deployment, set the same `MONGO_URI` and `JWT_SECRET` values in the Vercel project settings. The frontend uses `/api` automatically in production, so no extra client env variable is required unless you want to override it with `VITE_API_URL`.

---

## 🚀 Vercel Deployment

1. Import the GitHub repository into Vercel.
2. Use the root project directory.
3. Keep the build command as `npm run build`.
4. Set these environment variables in Vercel:
    - `MONGO_URI`
    - `JWT_SECRET`
5. Deploy.

The project uses a single catch-all serverless API in `api/[...path].js` and a static Vite frontend in `frontend/dist`, so the same deployment serves both the UI and the API.

---

## 📊 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email/password login form |
| Register | `/register` | New account registration |
| Dashboard | `/` | Hero section, stats, radar chart, top job matches |
| Job Match | `/job-match` | Job matching overview with quick stats |
| Job Performance | `/job-performance` | Line chart, skills breakdown, feedback, pie chart |
| Find Jobs | `/find-jobs` | Search, filters, job cards, detailed job view |
| Upload Resume | `/upload-resume` | Drag & drop file upload with tips |

---

## 📝 License

This project is for educational purposes.
