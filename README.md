# Trackora - Modern SaaS Issue Tracker

Trackora is a premium, modern issue tracking application built with the MERN stack. It features a stunning, highly responsive UI inspired by top-tier SaaS products like Linear and Vercel.

## 🚀 Features

- **Authentication**: Secure JWT-based login and registration system.
- **Issue Management**: Full CRUD (Create, Read, Update, Delete) capabilities for issues.
- **Advanced Filtering & Search**: Debounced search and multi-parameter filtering (Status, Priority, Severity).
- **Pagination**: Server-side pagination for optimal performance.
- **Data Export**: Export your issues to CSV or JSON with a single click.
- **Premium UI/UX**: Built with Tailwind CSS, Framer Motion, and shadcn/ui for smooth animations, glassmorphism, and a polished dark/light mode experience.
- **Global State**: Efficient state management using Zustand.

---

## 🛠️ Tech Stack

**Frontend (Client)**
- React 18 (Vite)
- TypeScript
- Tailwind CSS v4
- shadcn/ui & Radix UI
- Zustand (State Management)
- React Router v6
- React Hook Form + Zod (Validation)
- Framer Motion (Animations)
- Axios

**Backend (Server)**
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (Password Hashing)
- Zod (API Validation)

---

## 📦 Local Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and a [MongoDB Atlas](https://www.mongodb.com/atlas/database) account (or local MongoDB installed).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd issue-tracker
```

### 2. Backend Setup
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create an environment file
touch .env
```

Add the following variables to your `server/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend development server:
```bash
npm run dev
```
The API will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Create an environment file
touch .env
```

Add the following variable to your `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
The UI will run on `http://localhost:5173`.

---

## 🚀 Deployment Guide

This application separates the frontend and backend. They must be deployed as two separate services.

1. **Database**: Hosted on MongoDB Atlas.
2. **Backend**: Deploy the `server` folder to [Render.com](https://render.com) (Web Service). 
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - *Ensure you add your ENV variables in Render.*
3. **Frontend**: Deploy the `client` folder to [Vercel](https://vercel.com).
   - *Ensure you add `VITE_API_URL` pointing to your live Render backend URL.*

---

## 💻 Usage

1. Open `http://localhost:5173` in your browser.
2. Create a new account via the `/register` page.
3. You will be redirected to the Dashboard where you can view workspace statistics.
4. Navigate to the **Issues** tab to create, edit, filter, and export issues.
5. Use the top navigation bar to toggle between Dark and Light mode.
