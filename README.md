# Nimbus Drive

A Google Drive clone I built to actually learn backend development properly — auth, file storage, the works — instead of just reading about it. Users can register, log in, upload files, organize them, and download them back, all backed by JWT auth and S3 storage.

## Features

**Auth**
- Registration and login, passwords hashed with bcrypt
- JWT access tokens + refresh tokens, so sessions don't just live forever or die every 15 minutes
- Protected routes — you can't touch anything without being logged in

**Files**
- Upload to AWS S3 via `multer-s3`
- List, view, download, and delete your own files
- Everything scoped to the logged-in user — no seeing other people's stuff

**Stack**
- React 19 + Vite on the frontend, React Router for navigation
- TanStack Query for data fetching/caching (way less `useEffect` juggling than doing it by hand)
- Tailwind for styling
- Express 5 + Node on the backend, RESTful-ish API

## Tech Stack

### Frontend
- React 19 (Vite)
- React Router DOM v7
- TanStack React Query v5
- Tailwind CSS v4

### Backend
- Node.js + Express v5
- `jsonwebtoken` + `bcrypt` for auth
- Multer + `multer-s3` + `@aws-sdk/client-s3` for file uploads
- Nodemon for dev

## Project Structure

```
Nimbus Drive/
├── Backend/
│   ├── config/          # S3 and storage config
│   ├── controllers/     # auth + file logic
│   ├── middleware/      # JWT verification, etc.
│   ├── routes/          # route declarations
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/         # request helpers / hooks
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Getting Started

You'll need Node.js installed. Beyond that:

### 1. Clone it
```bash
git clone <repository-url>
cd "Google Drive Clone"
```

### 2. Backend

```bash
cd Backend
npm install
```

Create a `.env` in `Backend/`:
```env
PORT=3500
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=your_bucket_name
```

Then:
```bash
npm run dev
```

### 3. Frontend

```bash
cd ../Frontend
npm install
npm run dev
```

## API Endpoints

**Auth**
- `POST /register` — create an account
- `POST /login` — log in, get tokens back
- `GET /refresh` — get a new access token
- `POST /logout` — end the session
- `GET /me` — current user info

**Files**
- `GET /files` — list your files
- `POST /files` — upload a file (goes to S3)
- `DELETE /files/:id` — delete a file

---

Built as a learning project — if you spot something that could be done better, that's kind of the point.
