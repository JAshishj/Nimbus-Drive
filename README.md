# Nimbus Drive

A full-stack cloud storage web application inspired by Google Drive. Nimbus Drive allows users to register, log in, upload, view, manage, and download files using secure user authentication and cloud storage integration.

---

## 🚀 Features

- 🔑 **Authentication & Authorization**
  - User Registration and Login with hashed passwords using `bcrypt`.
  - JWT-based authentication (Access Tokens & Refresh Tokens).
  - Protected routes and session management.

- 📁 **File & Folder Management**
  - Upload files seamlessly using `multer` / `multer-s3` to AWS S3 storage.
  - Fetch and view file lists tailored to the logged-in user.
  - Download or delete uploaded files securely.

- ⚡ **Modern Tech Stack & UI**
  - High-performance frontend powered by Vite and React 19.
  - Data fetching and caching optimized with `@tanstack/react-query`.
  - Responsive styling built with Tailwind CSS.
  - Express v5 backend with RESTful API architecture.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19 (Vite)
- **Routing:** React Router DOM (v7)
- **State & Data Fetching:** TanStack React Query (v5)
- **Styling:** Tailwind CSS (v4)

### **Backend**
- **Runtime Environment:** Node.js
- **Framework:** Express.js (v5)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`
- **File Handling & Cloud Storage:** Multer, `@aws-sdk/client-s3`, `multer-s3`
- **Dev Server:** Nodemon

---

## 📁 Directory Structure

```text
Nimbus Drive/
├── Backend/
│   ├── config/          # S3 and storage configurations
│   ├── controllers/     # Authentication & file management logic
│   ├── middleware/      # JWT verification and route handlers
│   ├── routes/          # Express route declarations (auth, files, etc.)
│   ├── server.js        # Entry point for backend server
│   └── package.json
│
├── Frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── api/         # API request hooks and helpers
│   │   ├── components/  # Reusable UI components
│   │   ├── App.jsx      # Main application component
│   │   └── main.jsx     # App entry point
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Google Drive Clone"
```

### 2. Setup Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `Backend/` with your credentials:
   ```env
   PORT=3500
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   
   # AWS S3 Configuration
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   S3_BUCKET_NAME=your_bucket_name
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Setup Frontend

1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔐 API Endpoints Summary

- **Auth**
  - `POST /register` - Register a new user
  - `POST /login` - Log in user and receive JWT tokens
  - `GET /refresh` - Refresh access token
  - `POST /logout` - Log out user
  - `GET /me` - Get current user profile info

- **Files**
  - `GET /files` - List user files
  - `POST /files` - Upload a file to S3
  - `DELETE /files/:id` - Delete a file
