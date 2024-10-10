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


## API Endpoints

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


## Token Authentication

To authenticate requests that require a token, follow these steps:

1. Obtain a Token:
   - After successfully logging in as a user or admin, you will receive a JWT token in the response. Store this token securely.
     
2. Add the Token to Requests:
   - For any subsequent requests that require authentication, include the token in the Authorization header. The format should be as follows:
     ```
     Authorization: Bearer <your_token_here>
     ```

3. Handling Token Expiration:
   - If the token is expired or invalid, you will receive a 401 Unauthorized response. You may need to log in again to obtain a new token.
  

## Accepting or Rejecting Assignments

To accept or reject assignments as an admin, follow these steps:

1. View Assignments:
   - First, get the list of assignments by sending a GET request to:
     ```
     GET /api/admin/assignments
     ```
   - The response will include a list of assignments along with their IDs. Ensure you include the token in the Authorization header. 

3. Accept or Reject an Assignment:
   - To accept or reject a specific assignment, send a POST request to:
     
     ```
     POST /api/admin/assignments/:id/accept
     ```

     Replace `:id` with the ID of the assignment you want to accept, which you received from the previous step.
