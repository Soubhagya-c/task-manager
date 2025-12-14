# Task Management

A full-stack web application for task management, built with **FastAPI**, **React.js**, **PostgreSQL**, and **SQLAlchemy**, featuring secure JWT authentication, refresh tokens, and real-time CRUD operations for tasks and users.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Frontend Validation](#frontend-validation)
- [Error Handling](#error-handling)
- [Toast Notifications](#toast-notifications)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- User registration and login with JWT access and refresh tokens
- Profile update for users
- Task management: create, read, update, delete tasks
- Task status using enums (`pending`, `completed`)
- Refresh token auto-retry on token expiration
- Real-time toast notifications for success and error messages
- Global loading indicator during API calls
- Form validation using Zod/Yup on the frontend
- Role-based access and permissions (optional)

---

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, Alembic, JWT
- **Frontend:** React.js, TypeScript, Axios, React Hot Toast
- **Database:** PostgreSQL
- **Other Tools:** Docker (optional), Git, VS Code

---

## Getting Started 

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- npm or yarn

### Clone the repository

```bash
git clone https://github.com/Soubhagya-c/task-manager.git
cd task-manager
```
### Environment Set up 

# DATABASE
```
CREATE DATABASE dbname;
```

# Backend
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head # run migration
uvicorn backend.main:app --reload # run the backend
```
# Frontend

```bash
cd frontend
npm install
npm run dev
```

# DOCKER

## START

docker compose up --build

## STOP

docker compose down

## REBUILD CONTAINER

docker compose up --build --force-recreate

