import { useState } from 'react';
import type { ProjectWithTasks } from '../types';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

interface ProjectDetailProps {
  project: ProjectWithTasks;
  onBack: () => void;
  onUpdate: (name: string, description: string) => Promise<void>;
  onCreateTask: (title: string) => Promise<void>;
  onToggleTask: (id: number, completed: boolean) => Promise<void>;
  onUpdateTask: (id: number, title: string) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export function ProjectDetail({
  project,
  onBack,
  onUpdate,
  onCreateTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}: ProjectDetailProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editDesc, setEditDesc] = useState(project.description);

  const handleSaveName = async () => {
    if (editName.trim().length === 0) {
      setEditName(project.name);
      setIsEditingName(false);
      return;
    }
    if (editName.trim() !== project.name) {
      await onUpdate(editName.trim(), project.description);
    }
    setIsEditingName(false);
  };

  const handleSaveDesc = async () => {
    if (editDesc.trim() !== project.description) {
      await onUpdate(project.name, editDesc.trim());
    }
    setIsEditingDesc(false);
  };

  return (
    <div className="project-detail">
      <button className="back-button" onClick={onBack}>
        &larr; Back to Projects
      </button>

      <div className="project-header">
        {isEditingName ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveName();
              if (e.key === 'Escape') {
                setEditName(project.name);
                setIsEditingName(false);
              }
            }}
            className="edit-name-input"
            autoFocus
            maxLength={100}
          />
        ) : (
          <h2 onDoubleClick={() => setIsEditingName(true)}>{project.name}</h2>
        )}

        {isEditingDesc ? (
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            onBlur={handleSaveDesc}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setEditDesc(project.description);
                setIsEditingDesc(false);
              }
            }}
            className="edit-desc-input"
            autoFocus
            rows={2}
          />
        ) : (
          <p
            className="project-description clickable"
            onDoubleClick={() => setIsEditingDesc(true)}
          >
            {project.description || 'No description (double-click to add)'}
          </p>
        )}
      </div>

      <TaskForm onSubmit={onCreateTask} />

      <TaskList
        tasks={project.tasks}
        onToggle={onToggleTask}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </div>
  );
}
