# Professional Portfolio with Admin Panel

A modern, fully responsive portfolio website with a secure admin dashboard, built with React, Node.js, Prisma, and MongoDB.

## Features
- **Public Portfolio**: Home, About, Skills, Projects, Contact pages.
- **Admin Panel**: Secure login, Dashboard, management for Projects, Skills, and Messages.
- **Modern UI**: Glassmorphism, Animations (Framer Motion), Tailwind CSS.
- **Backend**: Node.js/Express REST API, Prisma ORM, MongoDB.

## Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URL)

## Setup Instructions

### 1. Database Setup
Ensure you have MongoDB running locally on port 27017, or update the `DATABASE_URL` in `server/.env`.

### 2. Backend Setup
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js # Seeds admin user and sample data
npm start
```
The server will start on `http://localhost:5000`.

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

## Environment Variables
**Server (.env)**
```
DATABASE_URL="mongodb://localhost:27017/portfolio"
JWT_SECRET="your_secret"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```
