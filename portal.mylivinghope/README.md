# My Living Hope Portal

A Progressive Web App (PWA) for managing My Living Hope's business operations.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **PWA**: Vite PWA Plugin

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Enable **Storage**
5. Copy your Firebase config from Project Settings > General > Your apps

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firebase Rules

```bash
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore, Storage, and Hosting
firebase deploy --only firestore:rules,storage:rules
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Features

- **Dashboard** - Overview stats and quick actions
- **Products** - Inventory management
- **Tasks** - To-do list with urgency levels
- **Contacts** - Church and partner database
- **Campaigns** - Marketing content tracking
- **Artists** - Commissioned artwork management
- **Emotions** - Prayer card content dataset
- **Brainstorm** - Ideas and innovation tracking
- **Checklist** - Business setup progress
- **Team** - User role management (Admin only)
- **Settings** - Profile and account settings

## User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full access - CRUD all data, manage users |
| Editor | Create and edit data |
| Viewer | Read-only access |

## PWA Features

- Installable on desktop and mobile
- Offline support for cached pages
- Responsive design

## First Admin Setup

After deploying, the first user to register will be a "viewer" by default. To make them an admin:

1. Go to Firebase Console > Firestore
2. Find the user document in `/users/{userId}`
3. Change `role` from `"viewer"` to `"admin"`
