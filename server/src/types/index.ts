// ─── DATABASE MODELS ────────────────────────────────────────────
// These match the rows in our database tables exactly.

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// ─── REQUEST TYPES ──────────────────────────────────────────────
// These define the shape of data the client sends.
// Notice: no id, created_at, updated_at - the server/database assigns those.

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
}

// ─── RESPONSE TYPES ─────────────────────────────────────────────
// A project with its tasks included (for the detail view).

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}
