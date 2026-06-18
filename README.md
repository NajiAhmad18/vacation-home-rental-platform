<div align="center">

<h1>🏡 LuxeKey — Premium Vacation Home Rentals</h1>

<p><em>A full-stack, production-ready vacation rental marketplace — discover, book, and manage premium holiday homes with seamless payments, real-time maps, and role-based dashboards.</em></p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Render_%2B_Vercel-black?style=for-the-badge&logo=vercel" />
</p>

<p>
  <a href="https://vacation-home-rental-platform.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/%F0%9F%9A%80%20Live%20Demo-vacation--home--rental--platform.vercel.app-22c55e?style=for-the-badge" />
  </a>
</p>

</div>

---

## 📌 Table of Contents

- [Live Demo](#-live-demo)
- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🚀 Live Demo

| | Link |
|---|---|
| 🌐 **Frontend (Vercel)** | [vacation-home-rental-platform.vercel.app](https://vacation-home-rental-platform.vercel.app/) |
| ⚙️ **Backend (Render)** | Singapore region — auto-scales on request |

> **Note:** The Render free tier spins down after inactivity — the first request may take ~30 seconds to wake up.

---

## 🌟 Overview

**LuxeKey** is a modern, end-to-end vacation rental marketplace that connects property owners with travelers seeking premium stays. Guests can discover holiday homes on an interactive map, check real-time availability, make secure Stripe payments, download PDF invoices, and leave reviews — all within a polished, animated UI.

Owners get a dedicated dashboard to list and manage their properties, while admins have full oversight with approval workflows and financial ledger tracking.

---

## ✨ Features

### 👤 For Guests
- 🔍 **Browse & Explore** — Search vacation homes with filters by location, price, bedrooms, and amenities
- 🗺️ **Interactive Maps** — View property locations powered by **Google Maps API** with Places Autocomplete
- 📅 **Real-Time Availability** — Live calendar showing booked dates to avoid double-bookings
- 💳 **Stripe Checkout** — Secure, card-based payments with instant confirmation
- 🧾 **Invoice Generation** — Download PDF/HTML invoices for every confirmed booking
- ❤️ **Wishlist** — Save favourite properties for later
- ⭐ **Reviews** — Rate and review stays after checkout
- 🔔 **Notifications** — In-app notification centre for booking updates

### 🏠 For Property Owners
- 📋 **Owner Dashboard** — Manage all listed properties from a dedicated panel
- 🖼️ **Cloudinary Image Uploads** — Drag-and-drop multi-image uploads with cloud storage
- 📊 **Ledger Tracking** — Revenue and payout records per property
- 🔒 **Property Status Control** — Toggle listings between active, hidden, or unavailable

### 🛡️ For Admins
- ✅ **Approval Workflow** — Review and approve new property listings with document verification
- 📈 **Platform-Wide Ledger** — Monitor all financial activity across the platform
- 🗑️ **User & Content Management** — Full CRUD access over listings and accounts

---

## 🏗️ Architecture

```
luxekey/
├── backend/          ← Node.js + Express REST API
└── frontend/         ← React 19 + Vite SPA
```

The platform follows a **monorepo** structure with a decoupled frontend/backend. The API is deployed independently on **Render** and the React SPA on **Vercel**, communicating over HTTPS with JWT-authenticated cookies.

```
Browser (LuxeKey React SPA)
      │  HTTPS / REST
      ▼
Express API (Render)
      │
      ├── MongoDB Atlas  (Data)
      ├── Cloudinary     (Images)
      └── Stripe         (Payments)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Zustand** | Global state management |
| **Tailwind CSS v3** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **@stripe/react-stripe-js** | Stripe payment UI |
| **@react-google-maps/api** | Interactive maps |
| **React Hook Form** | Form validation |
| **Axios** | HTTP client |
| **date-fns** | Date formatting & calculations |
| **lucide-react** | Icon library |
| **react-hot-toast** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | NoSQL database & ODM |
| **JWT + bcryptjs** | Authentication & password hashing |
| **Cloudinary + Multer** | Image upload & storage |
| **Stripe SDK** | Payment processing |
| **PDFKit** | Server-side PDF invoice generation |
| **cookie-parser** | Secure HTTP-only cookie sessions |
| **dotenv** | Environment configuration |

### Infrastructure
| Service | Usage |
|---|---|
| **Render** | Backend hosting (Singapore region) |
| **Vercel** | Frontend hosting & CDN |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Media storage & CDN |

---

## 📁 Project Structure

```
vacation-home-rental-platform/
│
├── backend/
│   ├── config/             # Database & service configuration
│   ├── controllers/        # Request handlers (auth, home, booking, payment…)
│   ├── lib/                # DB connection & helpers
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── home.model.js
│   │   ├── booking.model.js
│   │   ├── payment.model.js
│   │   ├── review.model.js
│   │   ├── wishlist.model.js
│   │   ├── ledger.model.js
│   │   └── notification.model.js
│   ├── routes/             # Express route definitions
│   ├── utils/              # Utility functions
│   ├── seed.js             # Database seeder
│   └── server.js           # Entry point
│
├── frontend/
│   ├── provider/           # Google Maps context provider
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── admin/      # Admin-specific components
│       │   ├── auth/       # Login, Signup, ProtectedRoute
│       │   ├── roomOwner/  # Owner dashboard components
│       │   └── user/       # User-facing components
│       ├── pages/          # Route-level page components
│       │   ├── HomePage.jsx
│       │   ├── ExplorePage.jsx
│       │   ├── propertyDetailsPage.jsx
│       │   ├── BookHome.jsx
│       │   ├── PaymentPage.jsx
│       │   ├── whislistPage.jsx
│       │   ├── NotificationsPage.jsx
│       │   ├── AboutPage.jsx
│       │   ├── ContactPage.jsx
│       │   ├── adminDashboard.jsx
│       │   └── RoomOwnerDashboard.jsx
│       ├── stores/         # Zustand state stores
│       ├── lib/            # Axios instance & helpers
│       └── const/          # App-wide constants
│
├── render.yaml             # Render deployment config
└── package.json            # Root scripts (backend)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **MongoDB Atlas** cluster URI
- A **Cloudinary** account
- A **Stripe** account (test keys are fine for development)
- A **Google Maps API** key with Maps JavaScript API + Places API enabled

---

### 1. Clone the Repository

```bash
git clone https://github.com/NajiAhmad18/vacation-home-rental-platform.git
cd vacation-home-rental-platform
```

> 💡 The project is branded as **LuxeKey** — the repo slug is the original directory name.

---

### 2. Backend Setup

```bash
# Install backend dependencies (from root)
npm install

# Create the backend environment file
cp .env.example .env   # or create manually — see Environment Variables below
```

Start the development server:

```bash
npm run dev
# → Server running at http://localhost:5000
```

Optionally seed the database with sample data:

```bash
node backend/seed.js
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create frontend environment file
cp .env.example .env   # or create manually — see Environment Variables below

npm run dev
# → App running at http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend — `.env` (root directory)

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vacation-rental

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# CORS — comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=http://localhost:5173

# Self-referencing base URL (used for invoice links)
API_BASE_URL=http://localhost:5000
```

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | ❌ | Register a new user or owner |
| `POST` | `/api/auth/signin` | ❌ | Login & receive JWT cookie |
| `POST` | `/api/auth/logout` | ✅ | Clear session cookie |
| `GET` | `/api/user/me` | ✅ | Get current user profile |
| `GET` | `/api/home` | ❌ | List all approved homes |
| `GET` | `/api/home/:id` | ❌ | Get single property details |
| `POST` | `/api/home` | ✅ Owner | Create a new listing |
| `PUT` | `/api/home/:id` | ✅ Owner | Update a listing |
| `DELETE` | `/api/home/:id` | ✅ Admin | Delete a listing |
| `GET` | `/api/booking` | ✅ | Get user bookings |
| `POST` | `/api/booking` | ✅ | Create a booking |
| `GET` | `/api/payments` | ✅ | Get payment history |
| `POST` | `/api/payments/create-intent` | ✅ | Create Stripe PaymentIntent |
| `GET` | `/api/wishlist` | ✅ | Get user's wishlist |
| `POST` | `/api/wishlist` | ✅ | Add to wishlist |
| `DELETE` | `/api/wishlist/:id` | ✅ | Remove from wishlist |
| `GET` | `/api/review/:homeId` | ❌ | Get reviews for a property |
| `POST` | `/api/review` | ✅ | Submit a review |
| `GET` | `/api/ledger` | ✅ Admin/Owner | Financial ledger records |
| `GET` | `/invoices/:bookingId` | ✅ | Download HTML/PDF invoice |

> **Auth** = requires valid JWT cookie. **Admin** / **Owner** = additionally requires that role.

---

## 👥 User Roles

| Role | Access Level |
|------|-------------|
| **Guest** (unauthenticated) | Browse homes, view details, explore map |
| **User** | Book homes, manage wishlist, submit reviews, download invoices |
| **Room Owner** | List properties, manage own listings, view revenue ledger |
| **Admin** | Approve listings, manage all users/homes, view full ledger |

Routes are protected via `ProtectedRoute` on the frontend and `auth.middleware.js` + role checks on the backend.

---

## ☁️ Deployment

The project is configured for a **zero-friction cloud deployment**:

### Backend → [Render](https://render.com)

The `render.yaml` in the root configures an automatic Render Web Service:

```yaml
services:
  - type: web
    name: vacation-rental-backend
    env: node
    region: singapore
    buildCommand: npm install
    startCommand: node backend/server.js
```

Set the following environment variables in the **Render Dashboard** (marked `sync: false` in `render.yaml`):
`MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `CLOUDINARY_*`, `ALLOWED_ORIGINS`, `API_BASE_URL`

### Frontend → [Vercel](https://vercel.com)

The `frontend/vercel.json` handles SPA routing rewrites. Deploy by importing the `frontend/` folder into Vercel and setting:
`VITE_API_BASE_URL`, `VITE_STRIPE_PUBLIC_KEY`, `VITE_GOOGLE_MAPS_API_KEY`

---

## 👨‍💻 Author

**Shiham Ahamed**

Built with ❤️ as a full-stack showcase project. **LuxeKey** demonstrates production-grade architecture with real-world integrations including Stripe, Cloudinary, Google Maps, and PDF invoice generation.

---

<div align="center">

⭐ **If you found this project useful, please consider giving it a star!** ⭐

</div>
