import { useState } from 'react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggle = () => {
    onToggle(task.id, !task.completed);
  };

  const handleSave = async () => {
    if (editTitle.trim().length === 0) {
      setEditTitle(task.title);
      setIsEditing(false);
      return;
    }

    if (editTitle.trim() !== task.title) {
      await onUpdate(task.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        className="task-checkbox"
      />

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={200}
        />
      ) : (
        <span className="task-title" onDoubleClick={() => setIsEditing(true)}>
          {task.title}
        </span>
      )}

      <button
        className="delete-button"
        onClick={() => onDelete(task.id)}
        title="Delete task"
      >
        &times;
      </button>
    </div>
  );
}
