# Order Tracking SaaS — Next.js + Neon + Prisma + Firebase

A secure, lightning-fast, production-ready Order Tracking SaaS built with **Next.js 15 (App Router)**, **Prisma ORM**, **Neon PostgreSQL**, **Firebase Authentication**, **Tailwind CSS v4**, and **Framer Motion**.

---

## Features

- **Apple-Inspired Design**: Rounded glassmorphism cards, premium typography (Inter/Geist), and soft shadows.
- **Dynamic Naming Logic**: Month Code + YY + DD + Order Number formatting with automatic suffix conflict resolution (`-1`, `-2`).
- **Role-Based Access Control**: Middleware protects routes (Admins cannot access user workspaces; Users cannot access admin consoles).
- **Public & Private Search**: Anyone can look up packages by ID instantly. Logged-in users automatically see their active shipment collections.
- **Admin Dashboard**: Create shipments, update courier logs, append infinite timeline checkpoints, view chart breakdowns (Recharts), and export CSVs.
- **Interactive Progress Bar**: Visual tracker indicating stages from Packing to final Delivery checkpoints.

---

## Technical Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Prisma ORM
- **Auth**: Firebase Auth Client (Google Login) + JSON Web Tokens (JWT) for secure session headers
- **Forms**: React Hook Form + Zod validation schemas

---

## Getting Started

### 1. Prerequisites

- Node.js (v18.x or newer)
- A **Neon PostgreSQL** account ([neon.tech](https://neon.tech))
- A **Firebase Project** with Google Auth provider enabled ([console.firebase.google.com](https://console.firebase.google.com))

### 2. Environment Variables

Create a `.env` file in the root directory (you can copy `.env.example` as a template):

```bash
cp .env.example .env
```

Fill in your connection pooling and direct database URIs, JWT signing secret, and Firebase config metrics.

### 3. Installation

Install all required node modules:

```bash
npm install
```

### 4. Database Setup & Seeding

Sync your schema with Neon and seed the initial Admin account:

```bash
# Push schema schemas
npx prisma db push

# Generate client
npx prisma generate

# Seed admin user (admin@ordertracking.com / Admin@1234)
npx tsx prisma/seed.ts
```

### 5. Running the Application

Launch the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Production Deployment

### Vercel Deployment

1. Set up a new project on Vercel importing this GitHub repository.
2. Add all environment variables defined in `.env.example` to the Vercel Project Settings.
3. Configure the build command as `prisma generate && next build`.
4. Deploy with confidence.
