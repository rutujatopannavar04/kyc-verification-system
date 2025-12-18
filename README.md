# KYC Verification System (Full-Stack Web Application)

## One-Line Summary

A secure, full-stack **KYC (Know Your Customer) Verification System** enabling document submission, real-time status tracking, and admin-level verification workflows, built using **React, Node.js, Express, and MongoDB**.

## Project Overview

This project replicates real-world **digital identity verification systems** used by banks, fintech companies, and regulatory platforms.
The system allows:
* **Users** to submit identity documents and track verification status
* **Admins** to review, approve, or reject KYC submissions through a dedicated dashboard
The application focuses on **security, scalability, and role-based access control**, making it highly relevant for enterprise and fintech environments.

## Problem Statement

Traditional KYC verification processes are:
* Manual and time-consuming
* Difficult to track and audit
* Prone to human error
This project solves the problem by implementing a **centralized, automated KYC workflow** with secure document handling and real-time verification updates.

## Data & Storage

* **Database**: MongoDB
* **Data Stored**:
  * User credentials and roles (user / admin)
  * KYC submission records
  * Document URLs and timestamps
  * Verification status (Pending / Verified / Rejected)
No external dataset is used — all data is dynamically generated and managed.

## Tech Stack 

### Frontend
* React (Vite)
* TypeScript
* Tailwind CSS
* Axios
* Role-based routing

### Backend
* Node.js
* Express.js
* MongoDB
* Mongoose
* RESTful APIs

### Authentication & Security
* JWT (JSON Web Tokens)
* Protected routes
* Role-based access control (RBAC)

### Utilities & Tools
* Multer (file uploads)
* MongoDB Compass
* Git & GitHub

## System Architecture & Workflow

1. User authentication using JWT
2. Secure KYC document upload
3. Storage of submissions in MongoDB
4. Admin-only access to all submissions
5. Admin verification (approve/reject)
6. Real-time status updates on user dashboard

## Key Features & Highlights

* Secure KYC document upload pipeline
* Role-based authentication (User / Admin)
* Real-time KYC status tracking
* Admin dashboard for centralized verification
* Scalable REST API design
* Clean, responsive UI using Tailwind CSS

##  Application Output

### User Dashboard
* Submit identity documents
* Track verification progress
* View submitted documents and timestamps

### Admin Dashboard
* View all KYC submissions
* Filter by verification status
* Approve or reject submissions
* Maintain audit-ready records
  
## How to Run the Project

### Backend Setup

```bash
cd Backend
npm install
node server.js
```

Create `.env` inside `Backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Create `.env` inside `Frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Author

**Rutuja Topannavar**
Undergraduate student with strong interest in **Full-Stack Development, Secure Web Applications, and System Design**.
Experienced in building **end-to-end MERN-based applications** with real-world use cases in fintech and enterprise systems.

## Why This Project Matters

* Demonstrates **real-world system thinking**
* Covers **authentication, authorization, and security**
* Implements **end-to-end full-stack development**
* Relevant to **fintech, banking, SaaS, and enterprise roles**
