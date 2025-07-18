import React, { useState } from 'react';
import { Task, Project } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface TaskFormProps {
  task?: Task;
  projects: Project[];
  onSubmit: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { assigned_to: string }) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  projects,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assigned_to: task?.assigned_to || '', // Email as text
    status: task?.status || 'todo' as Task['status'],
    priority: task?.priority || 'medium' as Task['priority'],
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
    project_id: task?.project_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      due_date: formData.due_date || null,
      project_id: formData.project_id || null,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const projectOptions = [
    { value: '', label: 'No Project' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  // Enable fields for new task creation, disable only for non-assigned edits
  const isNewTask = !task;
  const isDisabled = !isNewTask && task?.assigned_to !== formData.assigned_to;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
        placeholder="Enter task title"
        disabled={isDisabled}
      />
      <Input
        label="Assign To (Email)"
        type="email"
        value={formData.assigned_to}
        onChange={(e) => handleChange('assigned_to', e.target.value)}
        placeholder="user@example.com"
        required
        disabled={isDisabled}
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task description"
          disabled={isDisabled}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={priorityOptions}
          disabled={isDisabled}
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          disabled={false} // Always editable for status
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          value={formData.due_date}
          onChange={(e) => handleChange('due_date', e.target.value)}
          disabled={isDisabled}
        />
        <Select
          label="Project"
          value={formData.project_id}
          onChange={(e) => handleChange('project_id', e.target.value)}
          options={projectOptions}
          disabled={isDisabled}
        />
      </div>
      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};