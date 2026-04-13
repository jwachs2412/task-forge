import type { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ProjectList({
  projects,
  onSelect,
  onDelete,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects yet. Create your first project above!</p>
      </div>
    );
  }

  return (
    <div className="project-list">
      <h2>Your Projects</h2>
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <div
            className="project-card-content"
            onClick={() => onSelect(project.id)}
          >
            <h3>{project.name}</h3>
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
            <time className="project-date">
              Created{' '}
              {new Date(project.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this project and all its tasks?')) {
                onDelete(project.id);
              }
            }}
            title="Delete project"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
