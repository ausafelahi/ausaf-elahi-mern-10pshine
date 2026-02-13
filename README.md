# Nodus – Full-Stack Notes Management Application

Nodus is a production-ready full-stack notes management application built during my internship project. It demonstrates complete system design, secure authentication flows, structured architecture, API integration, and proper automated testing.

The goal of this project was not just to build a notes app, but to design a real-world, scalable full-stack system following industry best practices.



# Overview

Nodus allows users to:

-   Create, edit, and delete notes
-   Format notes with rich text
-   Organize notes using tags, colors, and pinning
-   Enable dark mode
-   Register and log in securely
-   Verify accounts via OTP email
-   Reset forgotten passwords securely
    
This project goes beyond basic CRUD functionality. It includes authentication lifecycle management, secure token handling, layered architecture, and automated testing.



# System Overview (For Non-Technical Reviewers)

The application has two main parts:

-   **Frontend** – What users see and interact with in the browser.
-   **Backend** – The server that handles authentication, business logic, and database operations.
    

The backend communicates with a MongoDB database and an email service for OTP verification.



# Technical Architecture

## Frontend Stack

-   React
-   TypeScript
-   Vite
-   Component-based design
-   Protected routes
-   API abstraction layer
-   Jest testing
    

## Backend Stack

-   Node.js
-   Express
-   MongoDB
-   RESTful API architecture
-   JWT-based authentication
-   OTP verification system
-   Password reset token system
-   Mocha & Chai testing
    

## External Integrations

-   Email service (Resend) for OTP verification
-   MongoDB database   

# Security Implementation

This project implements real-world security practices:

-   JWT-based session authentication
-   Secure password hashing
-   Protected API routes using middleware
-   Token validation system
-   Environment-based configuration using `.env`
-   Centralized error handling
  
The authentication flow covers:

Register → Send OTP → Verify OTP → Login → Reset Password

# Project Structure

Below is the accurate and complete project structure.   

## Root Directory
```
notes-app/  
│  
├── backend/ → Server, database, authentication, APIs  
├── frontend/ → User interface (what users see and interact with)  
└── README.md → Project documentation
``` 

## Backend Structure

The backend follows a layered architecture separating routes, controllers, models, middleware, and services.
```
backend/
│
├── config/                → Configuration files
│   ├── db.js              → Database connection setup
│   └── logger.js          → Pino logging configuration
│
├── controllers/           → Business logic for handling requests
│   ├── authController.js
│   ├── noteController.js
│   └── passwordResetController.js
│
├── middleware/            → Security & request processing layers
│   ├── auth.js
│   └── errorHandler.js
│
├── models/                → Database schemas (MongoDB models)
│   ├── Notes.js
│   ├── OTP.js
│   ├── Token.js
│   └── User.js
│
├── routes/                → API route definitions
│   ├── authRoutes.js
│   └── noteRoutes.js
│
├── services/              → External service integrations
│   └── emailService.js
│
├── test/                  → Backend testing suite
│   ├── integration/
│   │   └── auth.test.js
│   │
│   ├── unit/
│   │   ├── authController.test.js
│   │   ├── noteController.test.js
│   │   ├── notesModel.test.js
│   │   ├── passwordController.test.js
│   │   └── userModel.test.js
│   │
│   ├── helper.js
│   └── setup.js
│
├── utils/                 → Helper utilities
│
├── .env                   → Environment variables (not committed)
├── .env.example           → Sample environment template
├── .mocharc.js            → Mocha test configuration
├── package.json
└── server.js              → Application entry point
```
### Backend Highlights

-   MVC-style separation
-   Middleware-based authentication
-   Service layer for external integrations
-   Unit and integration test coverage
-   Centralized error handling
-   Secure environment configuration
    


## Frontend Structure

The frontend follows a component-based and modular structure.
```
frontend/
│
├── public/                → Static assets
│
├── src/
│   ├── components/        → Reusable UI components
│   ├── hooks/             → Custom React hooks
│   ├── layout/            → Page layout components
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   │
│   ├── pages/             → Page-level views
│   ├── lib/               → Utility libraries
│   │
│   ├── auth/              → Authentication pages
│   │   ├── SignUp.tsx
│   │   ├── SignIn.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   └── VerifyOTP.tsx
│   │
│   ├── dashboard/         → User dashboard
│   │   └── Dashboard.tsx
│   │
│   ├── home/              → Landing page
│   │   └── Home.tsx
│   │
│   ├── notes/             → Notes management
│   │   └── NoteEditor.tsx
│   │
│   ├── routes/            → Route protection
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/          → API abstraction layer
│   │   ├── api.ts
│   │   ├── noteApi.ts
│   │   └── __tests__/
│   │       ├── api.test.ts
│   │       └── noteApi.test.ts
│   │
│   ├── __tests__/         → Frontend component tests
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── setupTests.ts
│
├── index.html
├── vite.config.ts
├── jest.config.ts
├── eslint.config.js
├── tsconfig.json
└── package.json
```
### Frontend Highlights

-   TypeScript for type safety
-   Protected route implementation
-   Structured API layer
-   Modular page separation
-   Component testing
-   Clean routing system
    

# Local Setup Guide

Follow these steps to run the project locally.
 

## Clone the Repository
```
git clone <your-repository-url>  
cd notes-app
```
## Backend Setup
```
cd backend  
npm install
```
Create a `.env` file inside the backend folder:
```bash
PORT=5000  
MONGO\_URI=your\_mongodb\_connection\_string  
JWT\_SECRET=your\_jwt\_secret  
RESEND\_API\_KEY=your\_resend\_api\_key  
CLIENT\_URL=http://localhost:5173
```

Start the backend:
```
npm run dev
```
Backend runs on:
```
http://localhost:5000
```
## Frontend Setup

Open another terminal:
```
cd frontend  
npm install  
npm run dev
```
Frontend runs on:
```
http://localhost:5173
```
# Running Tests

## Backend
```
cd backend  
npm test
```
## Frontend
```
cd frontend  
npm test
```
Tests validate authentication flows, business logic, and API communication.

#   
Key Technical Skills Demonstrated

-   Full authentication lifecycle implementation
-   REST API development
-   Middleware-based security architecture
-   JWT token handling
-   OTP verification system
-   Secure password reset flow
-   Component-based React architecture
-   API abstraction layer
-   Unit and integration testing
-   Environment configuration management
    
# Internship Project Context

This project was developed as part of my internship to demonstrate:

-   Real-world full-stack application development
-   Clean architecture principles
-   Secure authentication design
-   Testing discipline
-   Scalable folder organization
    

It reflects practical engineering capability and production-ready implementation standards.
