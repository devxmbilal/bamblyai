# 🚀 Lumu AI - Social Media Agent

An AI-powered social media management platform that helps you create, schedule, and publish content across multiple platforms.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Login Credentials](#-login-credentials)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)

---

## ✨ Features

- **🤖 AI Content Generation** - Generate captions and hashtags using Google Gemini AI
- **📊 Dashboard** - View post statistics, analytics, and platform distribution
- **📅 Schedule Posts** - Schedule posts for later publishing
- **📝 Draft Management** - Save and manage draft posts
- **✅ Published Posts** - Track sent posts with engagement analytics
- **⚙️ Settings** - Update password and connect social accounts
- **🌐 Multi-Platform** - Support for Instagram, Twitter/X, Facebook, and LinkedIn

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, React, TypeScript |
| Backend | Express.js, Node.js, TypeScript |
| Database | MongoDB |
| AI | Google Gemini AI |
| Authentication | JWT (JSON Web Tokens) |

---

## 📦 Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
3. **npm** or **yarn** (comes with Node.js)
4. **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)
5. **Redis** - [Download](https://redis.io/)

---

## 📥 Installation

### Step 1: Clone/Download the Project
```bash
cd "c:\Users\MBilal\Desktop\social media agent"
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../social
npm install
```

### Step 4: Configure Environment Variables

Create `.env` file in the `server` folder:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/social-media-agent

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Google Gemini AI API Key
GOOGLE_AI_API_KEY=your-gemini-api-key-here
```

---

## 🚀 Running the Application

### Method 1: Run Each Service Separately

**Terminal 1 - Start MongoDB** (if running locally):
```bash
mongod
```

**Terminal 2 - Start Backend Server:**
```bash
cd "c:\Users\MBilal\Desktop\social media agent\server"
npm run dev
```
✅ Server runs on: `http://localhost:5000`

**Terminal 3 - Start Frontend:**
```bash
cd "c:\Users\MBilal\Desktop\social media agent\social"
npm run dev
```
✅ App runs on: `http://localhost:3000`

### Method 2: Quick Start Commands

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd social && npm run dev
```

---

## 🔐 Login Credentials

Default admin user:
```
Email: admin@lumu.ai
Password: admin123
```

### Create a New User
```bash
cd server
npx ts-node create-user.ts
```
Edit `create-user.ts` to change user details before running.

### Add Demo Data
```bash
cd server
npx ts-node seed-demo-posts.ts
```
This creates sample posts in Dashboard, Schedule, and Sent sections.

---

## 📁 Project Structure

```
social media agent/
├── server/                    # Backend API
│   ├── src/
│   │   ├── models/           # MongoDB models (User, Post, Media)
│   │   ├── routes/           # API routes (auth, posts, media)
│   │   ├── middleware/       # Authentication middleware
│   │   └── index.ts          # Server entry point
│   ├── create-user.ts        # Script to create users
│   ├── seed-demo-posts.ts    # Script to add demo data
│   └── .env                  # Environment variables
│
├── social/                    # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── login/            # Login page
│   │   └── globals.css       # Global styles
│   └── contexts/             # Auth context
│
└── agent/                     # AI Agent (Gemini)
    └── src/
        └── agent.ts          # AI content generation
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/password` | Update password |
| PUT | `/api/auth/connect-platform` | Connect social account |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/stats` | Get dashboard stats |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/generate` | Generate AI content |

---

## 🎨 App Sections

| Section | Description |
|---------|-------------|
| **Dashboard** | Overview of all posts, analytics, and recent activity |
| **Schedule** | View and manage scheduled posts (Edit/Delete) |
| **Drafts** | View and manage draft posts (Edit/Delete/Publish) |
| **Create Post** | Generate AI content and create new posts |
| **Sent Posts** | View published posts with engagement stats |
| **Analytics** | Detailed engagement metrics and platform breakdown |
| **Settings** | Update password and connect social accounts |

---

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists with correct values
- Run `npm install` again

### Frontend shows error
- Make sure backend is running first on port 5000
- Clear browser cache and refresh

### Login not working
- Run `npx ts-node create-user.ts` to create user
- Check MongoDB connection

### AI Generation not working
- Verify `GOOGLE_AI_API_KEY` in `.env` is valid
- Check console for API errors

---

## 📞 Support

If you have any issues, check:
1. All terminals are running (MongoDB, Backend, Frontend)
2. Environment variables are set correctly
3. All dependencies are installed (`npm install`)

---

Made with ❤️ by Lumu AI
