# TaskForge - Project Task Manager

A full-stack project task manager with persistent data storage. Create projects, add tasks, mark them complete, edit, and delete - all data persists in PostgreSQL.

## Features

- Create and manage multiple projects
- Add tasks to projects with full CRUD operations
- Mark tasks complete/incomplete
- Edit project and task details
- Delete projects (cascades to tasks)
- Data persists in PostgreSQL database

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Deployment**: Vercel (frontend), Render (backend + database)

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 16+

### Installation

```bash
# Clone the repository
git clone https://github.com/jwachs2412/task-forge.git
cd task-forge

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Create the database
createdb taskforge

# Run the schema
psql taskforge < src/db/schema.sql

# Create .env file
cp .env.example .env
# Edit .env with your database connection string
```

### Running Locally

```bash
# Terminal 1 - Start the backend (from task-forge/)
cd server
npm run dev

# Terminal 2 - Start the frontend (from task-forge/)
cd client
npm run dev
```

- Frontend: https://task-forge-khaki.vercel.app/
- Backend: https://task-forge-api.onrender.com

## API Endpoints

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | /api/projects                  | List all projects        |
| POST   | /api/projects                  | Create a project         |
| GET    | /api/projects/:id              | Get project with tasks   |
| PUT    | /api/projects/:id              | Update a project         |
| DELETE | /api/projects/:id              | Delete project and tasks |
| GET    | /api/projects/:projectId/tasks | List tasks for project   |
| POST   | /api/projects/:projectId/tasks | Create task in project   |
| PUT    | /api/tasks/:id                 | Update a task            |
| DELETE | /api/tasks/:id                 | Delete a task            |
| GET    | /api/health                    | Health check             |

## What I Learned

This project demonstrates understanding of:

- PostgreSQL database design (tables, foreign keys, constraints)
- SQL queries (SELECT, INSERT, UPDATE, DELETE)
- Full CRUD REST API design
- Error handling middleware
- Environment variable management
- Three-tier architecture deployment
