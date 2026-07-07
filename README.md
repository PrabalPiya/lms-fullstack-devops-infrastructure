# LearnHub LMS

A simple but realistic Learning Management System made for DevOps practice.

This project intentionally contains only application code:

- `frontend/` — React + TypeScript + Vite
- `backend/` — Node.js + Express + TypeScript
- Database layer — PostgreSQL + Prisma

No Docker, no Kubernetes, no CI/CD, no Helm, and no cloud files are included. You can add those yourself for DevOps practice.

## Features

- User registration and login
- JWT authentication
- Roles: Admin, Instructor, Student
- Course listing
- Course details with lessons
- Instructor/admin course creation
- Student enrollment
- Lesson completion tracking
- My Learning page
- Dashboard statistics
- PostgreSQL schema with Prisma
- Seed data for quick testing

## Project structure

```txt
simple-lms-fullstack/
├── backend/
│   ├── prisma/
│   └── src/
└── frontend/
    └── src/
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `DATABASE_URL` in `.env` with your PostgreSQL username and password.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/learnhub_lms"
JWT_SECRET="change-this-secret"
PORT=8080
CLIENT_URL="http://localhost:5173"
```

Create the database in PostgreSQL:

```sql
CREATE DATABASE learnhub_lms;
```

Then run:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend runs on:

```txt
http://localhost:8080
```

Health check:

```txt
http://localhost:8080/health
```

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Seed accounts

```txt
Admin
Email: admin@learnhub.local
Password: Admin@12345

Instructor
Email: instructor@learnhub.local
Password: Instructor@12345

Student
Email: student@learnhub.local
Password: Student@12345
```

## Useful backend commands

```bash
npm run dev
npm run build
npm start
npm run seed
npx prisma studio
```

## DevOps practice ideas

You can now add the DevOps layer yourself:

1. Dockerize frontend and backend
2. Add Docker Compose with PostgreSQL
3. Add GitHub Actions to build and push images
4. Deploy on EC2 with Docker Compose
5. Deploy on Kubernetes or K3s
6. Write Helm charts
7. Add ArgoCD GitOps
8. Add Prometheus/Grafana monitoring
9. Add Nginx reverse proxy
10. Add HTTPS with Certbot or ingress TLS

## Portfolio description

LearnHub LMS is a full-stack learning management platform built with React, Node.js, Express, TypeScript, PostgreSQL, and Prisma. It supports role-based authentication, course management, lesson tracking, enrollments, and dashboard analytics. The application was designed as a clean base for DevOps deployment practice using Docker, CI/CD, Kubernetes, Helm, ArgoCD, and monitoring tools.
