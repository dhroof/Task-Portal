# Task Portal

This is a back-end application designed to manage the assignments between users and admins. The application allows users to upload assignments and admins to accept or reject them.

## Features

- User registration and login
- Admin registration and login
- Upload assignments by users
- Admins can view, accept, or reject assignments

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js and npm installed

### Setup

1. Clone the Repository

   ```
   git clone https://github.com/dhroof/Task-Portal
   cd task-portal
   ```

2. Install Dependencies

   - Navigate to the project directory and install the required packages:

   ```
   npm install
   ```

3. Run the Application
   ```
   npm start
   ```
   The application will run on http://localhost:5000.

### API Endpoints

- User Routes

  - POST /api/user/register: Register a new user
  - POST /api/user/login: Login an existing user
  - GET /api/user: Get current user info
  - POST /api/user/upload: Upload an assignment
  - GET /api/user/admin: Get list of admins

- Admin Routes
  - POST /api/admin/register: Register a new admin
  - POST /api/admin/login: Login an existing admin
  - GET /api/admin: Get current admin info
  - GET /api/admin/assignments: View assignments
  - POST /api/admin/assignments/:id/accept: Accept an assignment
  - POST /api/admin/assignments/:id/reject: Reject an assignment
