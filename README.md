# EduSphere - Online Course Management System

EduSphere is a full-stack online course management system developed for Advanced Web Technology.

## Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Student dashboard
- Admin dashboard
- Course listing and course details
- Course enrollment system
- Profile update
- Password update
- Responsive frontend design

## Tech Stack

Frontend:
- React.js
- React Router
- CSS

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose

Authentication and Security:
- JWT
- bcrypt
- Environment variables
- Role-based access control

## Folder Structure

edusphere - React frontend
edusphere-server - Node.js and Express backend

## How To Run Locally

Backend:
cd edusphere-server
npm install
npm run dev

Frontend:
cd edusphere
npm install
npm start

## Environment Variables

Backend uses:
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRE
- JWT_COOKIE_EXPIRE
- CLIENT_URL

Frontend uses:
- REACT_APP_API_URL

## Project Status

Completed for Advanced Web Technology final submission.
