import { useState, useEffect } from 'react';
import type { Project, ProjectWithTasks } from './types';
import * as api from './services/api';
import { ProjectForm } from './components/ProjectForm';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectList } from './components/ProjectList';
import './App.css';

function App() {
  // ─── STATE ──────────────────────────────────────────────────
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithTasks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ─── LOAD PROJECTS ON MOUNT ─────────────────────────────────
  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setIsLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Is the backend running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // ─── PROJECT OPERATIONS ─────────────────────────────────────

  async function handleCreateProject(data: {
    name: string;
    description?: string;
  }) {
    const newProject = await api.createProject(data);
    setProjects((prev) => [newProject, ...prev]);
  }

  async function handleSelectProject(id: number) {
    try {
      const project = await api.getProject(id);
      setSelectedProject(project);
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  }

  async function handleUpdateProject(name: string, description: string) {
    if (!selectedProject) return;

    const updated = await api.updateProject(selectedProject.id, {
      name,
      description,
    });
    setSelectedProject({ ...selectedProject, ...updated });
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  }

  async function handleDeleteProject(id: number) {
    await api.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  }

  // ─── TASK OPERATIONS ────────────────────────────────────────

  async function handleCreateTask(title: string) {
    if (!selectedProject) return;

    const newTask = await api.createTask(selectedProject.id, { title });
    setSelectedProject({
      ...selectedProject,
      tasks: [...selectedProject.tasks, newTask],
    });
  }

  async function handleToggleTask(id: number, completed: boolean) {
    const updated = await api.updateTask(id, { completed });
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        tasks: selectedProject.tasks.map((t) =>
          t.id === updated.id ? updated : t
        ),
      });
    }
  }

  async function handleUpdateTask(id: number, title: string) {
    const updated = await api.updateTask(id, { title });
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        tasks: selectedProject.tasks.map((t) =>
          t.id === updated.id ? updated : t
        ),
      });
    }
  }

  async function handleDeleteTask(id: number) {
    await api.deleteTask(id);
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        tasks: selectedProject.tasks.filter((t) => t.id !== id),
      });
    }
  }

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <h1
          onClick={() => setSelectedProject(null)}
          style={{ cursor: 'pointer' }}
        >
          TaskForge
        </h1>
        <p>Project Task Manager</p>
      </header>

      <main className="app-main">
        {isLoading && <p className="loading">Loading projects...</p>}
        {error && <p className="error-message">{error}</p>}

        {!isLoading && !error && (
          <>
            {selectedProject ? (
              <ProjectDetail
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                onUpdate={handleUpdateProject}
                onCreateTask={handleCreateTask}
                onToggleTask={handleToggleTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ) : (
              <>
                <ProjectForm onSubmit={handleCreateProject} />
                <ProjectList
                  projects={projects}
                  onSelect={handleSelectProject}
                  onDelete={handleDeleteProject}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
