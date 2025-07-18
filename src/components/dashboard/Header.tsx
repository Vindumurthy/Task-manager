import React from 'react';
import { User } from '../../types';
import { LogOut, Plus, FolderPlus } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
  onCreateTask: () => void;
  onCreateProject: () => void;
  role: 'admin' | 'user';
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSignOut,
  onCreateTask,
  onCreateProject,
  role,
}) => {
  console.log('Header role:', role); // Debug log to verify role
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-sm text-gray-500">Welcome back, {user.email}</p>
          </div>

          <div className="flex items-center space-x-3">
            {role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateProject}
                className="flex items-center space-x-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>New Project</span>
              </Button>
            )}

            {role === 'admin' && (
              <Button
                size="sm"
                onClick={onCreateTask}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};