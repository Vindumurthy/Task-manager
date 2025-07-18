import React, { useState, useMemo } from 'react';
import { Task, Project } from '../../types';
import { TaskCard } from '../tasks/TaskCard';
import { TaskFilters } from '../tasks/TaskFilters';
import { TaskForm } from '../tasks/TaskForm';
import { ProjectForm } from '../projects/ProjectForm';
import { Header } from './Header';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { CheckCircle, Clock, AlertCircle, FolderOpen, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const role = user?.role || 'user';
  console.log('Dashboard role:', role); // Debug log

  const {
    tasks,
    projects,
    loading,
    createTask,
    updateTask,
    deleteTask,
    createProject,
  } = useTasks(user?.id, user?.email, role);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [assignedFilter, setAssignedFilter] = useState<string>('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(true);

  const filteredTasks: Task[] = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      const matchesProject = !projectFilter || task.project_id === projectFilter;
      const matchesAssigned = !assignedFilter || (task.assigned_to && task.assigned_to.toLowerCase().includes(assignedFilter.toLowerCase()));
      const isAdminView = role === 'admin' || (role === 'user' && task.assigned_to === user?.email);
      return isAdminView && matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssigned;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter, assignedFilter, role, user?.email]);

  const stats = useMemo(() => {
    const total = filteredTasks.length; // Use filteredTasks instead of tasks
    const completed = filteredTasks.filter((t) => t.status === 'completed').length;
    const inProgress = filteredTasks.filter((t) => t.status === 'in_progress').length;
    const overdue = filteredTasks.filter(
      (t) =>
        t.due_date &&
        new Date(t.due_date) < new Date() &&
        t.status !== 'completed'
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, overdue, completionRate };
  }, [filteredTasks]); // Depend on filteredTasks

  const handleCreateTask = async (
    taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { assigned_to: string }
  ) => {
    try {
      await createTask(taskData);
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`Failed to create task: ${error.message || 'Unknown error'}`);
    }
  };

  const handleUpdateTask = async (
    taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { assigned_to: string }
  ) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert(`Failed to update task: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Failed to delete task: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleCreateProject = async (
    projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      await createProject(projectData);
      setIsProjectModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Failed to create project: ${error.message || 'Unknown error'}`);
    }
  };

  const handleEditTask = (task: Task) => {
    if (role === 'user' && task.assigned_to !== user?.email) return;
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      await updateTask(id, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
      alert(`Failed to update task status: ${error.message || 'Unknown error'}`);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="text-gray-600 mt-4 text-lg">
            {loading ? 'Loading your workspace...' : 'Loading user session...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header
        user={user}
        onSignOut={signOut}
        onCreateTask={() => role === 'admin' && setIsTaskModalOpen(true)}
        onCreateProject={() => role === 'admin' && setIsProjectModalOpen(true)}
        role={role}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<FolderOpen className="h-6 w-6 text-blue-600" />}
            label="Total Tasks"
            value={stats.total}
            bgColor="bg-blue-100"
            hoverColor="group-hover:bg-blue-200"
          />
          <StatsCard
            icon={<CheckCircle className="h-6 w-6 text-green-600" />}
            label="Completed"
            value={stats.completed}
            bgColor="bg-green-100"
            hoverColor="group-hover:bg-green-200"
            subtitle={`${stats.completionRate}% completion rate`}
            subtitleColor="text-green-600"
          />
          <StatsCard
            icon={<Clock className="h-6 w-6 text-blue-600" />}
            label="In Progress"
            value={stats.inProgress}
            bgColor="bg-blue-100"
            hoverColor="group-hover:bg-blue-200"
          />
          <StatsCard
            icon={<AlertCircle className="h-6 w-6 text-red-600" />}
            label="Overdue"
            value={stats.overdue}
            bgColor="bg-red-100"
            hoverColor="group-hover:bg-red-200"
          />
        </div>

        {/* Filters */}
        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          assignedFilter={assignedFilter}
          onAssignedFilterChange={setAssignedFilter}
          projects={projects}
        />

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={role === 'admin' ? handleDeleteTask : undefined}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl shadow bg-white p-4 group">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {tasks.length === 0 
                  ? 'Create your first task to get started with your productivity journey!' 
                  : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                }
              </p>
              {role === 'admin' && tasks.length === 0 && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Create Your First Task
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {(role === 'admin' || editingTask) && (
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          variant="glass"
        >
          <TaskForm
            task={editingTask || undefined}
            projects={projects}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask} // Correct handler
            onCancel={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
          />
        </Modal>
      )}

      {/* Project Modal */}
      {role === 'admin' && (
        <Modal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          title="Create New Project"
          variant="glass"
        >
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsProjectModalOpen(false)}
          />
        </Modal>
      )}

      {/* Notification Panel for Users */}
      {role === 'user' && isNotificationVisible && (
        <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <button
              onClick={() => setIsNotificationVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tasks
              .filter((task) => task.assigned_to === user?.email)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-gray-600">Assigned: {new Date(task.created_at).toLocaleDateString()}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  hoverColor: string;
  subtitle?: string;
  subtitleColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  bgColor,
  hoverColor,
  subtitle,
  subtitleColor = "text-gray-500"
}) => (
  <div className="rounded-xl shadow bg-white p-4 group">

    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`p-3 ${bgColor} rounded-xl ${hoverColor} transition-colors duration-200`}>
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className={`text-xs ${subtitleColor}`}>{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);