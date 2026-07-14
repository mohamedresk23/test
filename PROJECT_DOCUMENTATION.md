# 🚀 TaskFlow Project Documentation (Smart Task & Goal Management System)

> [!NOTE]
> **TaskFlow** is a modern, comprehensive web application designed for efficient task, goal, and schedule management. Built with a strong focus on User Experience (UX), high performance, and full **Offline-First** capability with automatic synchronization.

---

## 📋 Project Overview

**TaskFlow** provides a smart digital workspace helping users organize their time, track their goals, and analyze their productivity effortlessly. The application features a modern, responsive design with full support for both **Dark / Light Mode**.

### ✨ Key Features:
1. **Offline-First Strategy:** Tasks and data are stored locally in the browser via **IndexedDB (Dexie.js)**, ensuring lightning-fast operation even without an internet connection, supported by a `Sync Queue` system to sync changes to the server upon re-connection.
2. **Drag & Drop Task Management:** Organize, reorder, and categorize tasks flexibly using state-of-the-art drag-and-drop libraries (`@dnd-kit`).
3. **Full Interactive Calendar:** View tasks and due dates across multiple calendar views (Monthly, Weekly, Daily, and List views) with interactive scheduling (`FullCalendar v6`).
4. **Goals Tracking:** Link daily tasks to major long-term goals and track progress step-by-step.
5. **Analytics Dashboard:** Interactive charts and key performance indicators (`Recharts`) to visualize task and goal completion rates.
6. **PDF Report Export:** Export task reports and analytical charts into professional PDF documents with a single click (`jsPDF` & `html2canvas`).
7. **Gamification & Visual Effects:** Celebratory confetti animations when achieving goals and completing tasks (`canvas-confetti`).

---

## 🛠️ Technology Stack

The application is engineered using modern web technologies to ensure optimal performance, security, and maintainability:

### 1️⃣ Frontend Stack

| Technology / Library | Role & Purpose in Project |
| :--- | :--- |
| **React 18** | UI component library with fast automatic loading and `Suspense` lazy loading. |
| **TypeScript (v5.9)** | Strong type safety to minimize runtime errors and improve developer efficiency. |
| **Vite (v8)** | High-speed build tool and dev server with Progressive Web App (PWA) support. |
| **Tailwind CSS (v3.4)** | Utility-first CSS framework for flexible, responsive interface design (`@tailwindcss/forms`). |
| **Zustand (v5)** | Lightweight global state management (`taskStore`, `goalStore`, `authStore`, `themeStore`, `langStore`). |
| **React Router DOM (v6)** | Routing, navigation, and core layout management (`AppShell`). |
| **i18next & react-i18next** | Internationalization and real-time translation management. |
| **Lucide React** | Modern, consistent icon set covering all application components. |

---

### 2️⃣ Data & Offline Layer

| Technology / Library | Role & Purpose in Project |
| :--- | :--- |
| **Dexie.js & Dexie React Hooks** | Local database engine over `IndexedDB` for tasks, goals, and offline `SyncQueue` management. |
| **@dnd-kit (Core & Sortable)** | Advanced drag-and-drop engine for list sorting and smooth animations. |
| **FullCalendar v6** | Professional calendar integration for scheduling across multiple time ranges. |
| **Axios** | HTTP client for backend RESTful API requests and data queue synchronization. |

---

### 3️⃣ UI Enhancements & Utilities

| Technology / Library | Role & Purpose in Project |
| :--- | :--- |
| **Recharts** | Data visualization and charts (Bar, Pie, Line charts) on the `Stats` page. |
| **jsPDF & html2canvas** | Capturing UI elements and reports to generate downloadable PDF documents. |
| **Canvas Confetti** | Interactive celebratory effects triggered when completing goals or tasks. |
| **Date-fns (v4)** | Lightweight, performant date formatting, parsing, and comparison utility. |
| **clsx & tailwind-merge** | Safe conditional class merging for custom UI styling. |
| **Vite Plugin PWA & Workbox Window** | Enables full installation and offline functionality as a Progressive Web App. |

---

### 4️⃣ Backend API & Database

> [!TIP]
> The project includes a dedicated Node.js backend inside the `backend/` directory providing authentication and cloud synchronization services.

| Technology / Library | Role & Purpose in Project |
| :--- | :--- |
| **Node.js & Express.js** | Backend server framework for handling requests and building RESTful APIs. |
| **PostgreSQL (`pg`)** | Primary relational database for persistent storage of users, tasks, and goals. |
| **JWT & Bcrypt** | Secure password hashing, session management, and request authentication. |
| **Cookie Parser & CORS** | Handling HttpOnly Cookies and setting secure cross-origin policies. |
| **Express Rate Limit** | Protection against brute-force attacks and DDOS throttling. |

---

## 🏗️ Project Architecture & Structure

```text
test/
├── src/
│   ├── components/      # Reusable UI Components
│   │   ├── layout/      # General layout components (AppShell, Navigation, Header)
│   │   └── ui/          # Shared UI elements (Buttons, Modals, Inputs)
│   ├── db/              # Dexie.js setup and local database schema (schema.ts)
│   ├── features/        # Advanced task features and components (tasks)
│   ├── i18n/            # Internationalization configuration and translation files
│   ├── lib/             # Utility helpers and functions
│   ├── pages/           # Main application pages:
│   │   ├── Dashboard.tsx  # Main overview dashboard and quick stats
│   │   ├── Tasks.tsx      # Task list with filtering and drag-and-drop
│   │   ├── Goals.tsx      # Long-term goals tracking and progress bars
│   │   ├── Calendar.tsx   # Comprehensive interactive calendar (FullCalendar)
│   │   ├── Stats.tsx      # Performance analytics and PDF report export
│   │   └── Settings.tsx   # User preferences, theme, and account settings
│   ├── store/           # Zustand global stores:
│   │   ├── taskStore.ts   # Local task state and sync status
│   │   ├── goalStore.ts   # Goals state management
│   │   ├── authStore.ts   # User authentication and session store
│   │   ├── themeStore.ts  # Theme state (Dark/Light mode)
│   │   └── langStore.ts   # Language preference state
│   ├── App.tsx          # Core application router and lazy Suspense wrapper
│   └── main.tsx         # Application entry point
│
├── backend/             # Backend API Server
│   ├── routes/          # Auth and task synchronization routes
│   ├── middleware/      # JWT authentication and rate limit middleware
│   ├── db.ts            # PostgreSQL database connection pool
│   └── index.ts         # Express server setup
│
├── package.json         # Frontend dependencies and scripts
└── tailwind.config.js   # Tailwind CSS configuration and theme design tokens
```

---

## ⚙️ Setup & Local Development Guide

### 1. Running the Frontend
From the project root directory, install dependencies and start the Vite development server:

```bash
# Install required dependencies
npm install

# Start development server
npm run dev
```

### 2. Running the Backend Server
For cloud synchronization and user authentication, navigate to the `backend/` directory and start the server:

```bash
cd backend

# Install backend dependencies
npm install

# Start backend dev server with auto-reload
npm run dev
```

### 3. Production Build
To create an optimized production build of the frontend web application:

```bash
npm run build
```
