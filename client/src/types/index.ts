// ─── DATABASE MODELS ────────────────────────────────────────────
// These match what the backend returns.

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

// ─── COMPOSITE TYPES ────────────────────────────────────────────

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

// ─── REQUEST TYPES ──────────────────────────────────────────────

export interface CreateProjectRequest {
  name: string;
  description?: string;
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
