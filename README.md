# Task Manager Full Stack Application

This is a full-stack Task Manager application built using **FastAPI** for the backend, **React** for the frontend, and **MongoDB** as the database.

## Features

- User authentication and authorization using JWT.
- Create, update, delete, and manage tasks.
- Task filtering, sorting, and pagination.
- Task priority and due date support.
- Responsive user-friendly dashboard.

---

## Installation & Setup

### 1️⃣ Backend Setup (FastAPI + MongoDB)

#### Prerequisites:

- Install **Python 3.8+**
- Install **MongoDB** and ensure it is running

#### Steps:

```sh
# Clone the repository
git clone https://github.com/YOUR-USERNAME/Task_Manager_Full_Stack.git
cd Task_Manager_Full_Stack/backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload
```

- The FastAPI server should now be running at `http://127.0.0.1:8000`
- Visit `http://127.0.0.1:8000/docs` to see the API documentation

---

### 2️⃣ Frontend Setup (React)

#### Prerequisites:

- Install **Node.js** (v16+ recommended)

#### Steps:

```sh
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Make sure you have 'tailwindcss' installed.
npm install tailwindcss

# Start the React development server
npm start
```

- The React app should now be running at `http://localhost:5173`

---

## Database Configuration

- Ensure MongoDB is running.
- Update the database URL in database file inside the backend folder:

---

## Usage

1. Register a new user.
2. Log in to receive a JWT token.
3. Use the token to access protected routes (tasks dashboard, etc.).
4. Create, update, filter, and manage tasks.

---

## API Endpoints (Backend)

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | /users/register           | Register a new user            |
| POST   | /users/login              | Authenticate user              |
| GET    | /users/me                 | Get user profile               |
| GET    | /users/                   | Get all users                  |
| POST   | /tasks/create             | Create a new task              |
| GET    | /tasks/                   | Get all tasks                  |
| DELETE | /tasks/{task_id}          | Delete a task by ID            |
| PATCH  | /tasks/{task_id}          | Update a task by ID            |
| PUT    | /tasks/complete/{task_id} | Mark a task as completed by ID |

---

## Deployment (Optional)

- To deploy the backend, use **Docker, Heroku, or a cloud server (AWS, DigitalOcean, etc.).**
- To deploy the frontend, use **Vercel, Netlify, or Firebase Hosting.**

---

## Additional Notes

- Ensure **CORS** is properly configured in FastAPI for frontend-backend communication.

---

## Contribution

Feel free to submit issues and pull requests!

---
