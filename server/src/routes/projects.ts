import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';
import { CreateProjectRequest, UpdateProjectRequest } from '../types';

const router = Router();

// ─── GET /api/projects ──────────────────────────────────────────
// List all projects, newest first.
//
// SQL: SELECT * FROM projects ORDER BY created_at DESC
// Response: 200 OK, [{ id, name, description, created_at, updated_at }, ...]
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/projects ─────────────────────────────────────────
// Create a new project.
//
// Body: { name: "My Project", description: "Optional description" }
// SQL: INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *
// Response: 201 Created, { id, name, description, created_at, updated_at }
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body as CreateProjectRequest;

    // ─── VALIDATION ───────────────────────────────────────────
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Project name is required' });
      return;
    }

    if (name.trim().length > 100) {
      res
        .status(400)
        .json({ error: 'Project name must be 100 characters or fewer' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *',
      [name.trim(), description?.trim() || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/projects/:id ──────────────────────────────────────
// Get a single project with all its tasks.
//
// SQL: Two queries - one for the project, one for its tasks.
// Response: 200 OK, { id, name, description, ..., tasks: [...] }
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (projectResult.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const tasksResult = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC',
      [id]
    );

    res.json({
      ...projectResult.rows[0],
      tasks: tasksResult.rows,
    });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/projects/:id ──────────────────────────────────────
// Update a project's name and/or description.
//
// Body: { name?: "New Name", description?: "New description" }
// SQL: UPDATE projects SET ... WHERE id = $1 RETURNING *
// Response: 200 OK, { id, name, description, created_at, updated_at }
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body as UpdateProjectRequest;

    // Validate: at least one field must be provided
    if (name === undefined && description === undefined) {
      res.status(400).json({
        error: 'At least one field (name or description) is required',
      });
      return;
    }

    if (
      name !== undefined &&
      (typeof name !== 'string' || name.trim().length === 0)
    ) {
      res.status(400).json({ error: 'Project name cannot be empty' });
      return;
    }

    if (name !== undefined && name.trim().length > 100) {
      res
        .status(400)
        .json({ error: 'Project name must be 100 characters or fewer' });
      return;
    }

    // Build the UPDATE query dynamically based on which field were sent
    const fields: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name.trim());
    }
    if (description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(description.trim());
    }
    fields.push(`updated_at = NOW()`);

    values.push(Number(id));

    const result = await pool.query(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/projects/:id ───────────────────────────────────
// Delete a project and all its tasks (CASCADE handles tasks).
//
// SQL: DELETE FROM projects WHERE id = $1
// Response: 204 No Content
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `DELETE FROM projects WHERE id = $1 RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // 204 = "No Content" = the standard status for successful deletion
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export { router as projectsRouter };
