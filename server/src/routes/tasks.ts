import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';
import { CreateTaskRequest, UpdateTaskRequest } from '../types';

const router = Router();

// ─── GET /api/projects/:projectId/tasks ────────────────────────
// List all tasks for a specific project.
//
// SQL: SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC
// Response: 200 OK, [{ id, project_id, title, completed, ... }, ...]
router.get(
  '/projects/:projectId/tasks',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;

      // Verify the project exists
      const projectResult = await pool.query(
        'SELECT id FROM projects WHERE id = $1',
        [projectId]
      );

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const result = await pool.query(
        'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC',
        [projectId]
      );

      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /api/projects/:projectId/tasks ────────────────────────
// Create a new task in a specific project.
//
// Body: { title: "My new task" }
// SQL: INSERT INTO tasks (project_id, title) VALUES ($1, $2) RETURNING *
// Response: 201 Created, { id, project_id, title, completed, ... }
router.post(
  '/projects/:projectId/tasks',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const { title } = req.body as CreateTaskRequest;

      // Validate
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({ error: 'Task title is required' });
        return;
      }

      if (title.trim().length > 200) {
        res
          .status(400)
          .json({ error: 'Task title must be 200 characters or fewer' });
        return;
      }

      // Verify the project exists
      const projectResult = await pool.query(
        'SELECT id FROM projects WHERE id = $1',
        [projectId]
      );

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const result = await pool.query(
        'INSERT INTO tasks (project_id, title) VALUES ($1, $2) RETURNING *',
        [projectId, title.trim()]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }
);

// ─── PUT /api/tasks/:id ─────────────────────────────────────────
// Update a task (toggle completed, rename, etc.).
//
// Body: { title?: "New title", completed?: true }
// SQL: UPDATE tasks SET ... WHERE id = $1 RETURNING *
// Response: 200 OK, { id, project_id, title, completed, ... }
router.put(
  '/tasks/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, completed } = req.body as UpdateTaskRequest;

      // Validate: at least one field must be provided
      if (title === undefined && completed === undefined) {
        res.status(400).json({
          error: 'At least one field (title or completed) is required',
        });
        return;
      }

      if (
        title !== undefined &&
        (typeof title !== 'string' || title.trim().length === 0)
      ) {
        res.status(400).json({ error: 'Task title cannont be empty' });
        return;
      }

      if (title !== undefined && title.trim().length > 200) {
        res
          .status(400)
          .json({ error: 'Task title must be 200 characters or fewer' });
        return;
      }

      if (completed !== undefined && typeof completed !== 'boolean') {
        res.status(400).json({ error: 'Completed must be a boolean' });
        return;
      }

      // Build dynamic UPDATE query
      const fields: string[] = [];
      const values: (string | number | boolean)[] = [];
      let paramIndex = 1;

      if (title !== undefined) {
        fields.push(`title = $${paramIndex++}`);
        values.push(title.trim());
      }
      if (completed !== undefined) {
        fields.push(`completed = $${paramIndex++}`);
        values.push(completed);
      }
      fields.push('updated_at = NOW()');

      values.push(Number(id));

      const result = await pool.query(
        `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/tasks/:id ──────────────────────────────────────
// Delete a single task.
//
// SQL: DELETE FROM tasks WHERE id = $1
// Response: 204 No Content
router.delete(
  '/tasks/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export { router as tasksRouter };
