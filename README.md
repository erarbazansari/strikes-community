<div align="center">
  <img src="public/logo/256-mac.png" alt="Logo" width="100" height="100">
  <h1>Strikes Community</h1>
  <p>A feature-rich strikes community built with Next.js, Socket.io, Prisma, and Tailwind CSS.</p>
</div>

## 🌟 Features

-   **Real-time Messaging**: Socket.io powered chat.
-   **Servers & Channels**: Create and customize servers and channels (Text,
    Audio, Video).
-   **Authentication**: Secure login via Clerk.
-   **File Uploads**: Image and PDF sharing using UploadThing.
-   **Video/Audio Calls**: Integrated signaling for voice and video features.
-   **Responsive Design**: Modern UI with Light/Dark mode support.

## 🛠️ Tech Stack

-   **Framework**: Next.js 16
-   **Language**: TypeScript
-   **Database**: PostgreSQL (Prisma ORM)
-   **Styling**: Tailwind CSS & Shadcn/ui
-   **State Management**: Zustand & React Query
-   **Real-time**: Socket.io

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ErArbazAnsari/discord-fullstack.git
cd discord-fullstack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and refer to `.env.example` for the
required keys. (VERY IMPORTANT)

### 4. Setup Database

```bash
bun install
bun prisma generate
bun prisma db push
bun run build
```

### 5. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
