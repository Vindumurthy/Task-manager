import React from 'react';
import { Task, Project } from '../../types';
import { Search, Filter, X } from 'lucide-react';
import { Card } from '../../ui/Card';


import { Badge } from '../ui/Badge';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  projectFilter: string;
  onProjectFilterChange: (project: string) => void;
  assignedFilter: string;
  onAssignedFilterChange: (email: string) => void;
  projects: Project[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  projectFilter,
  onProjectFilterChange,
  assignedFilter,
  onAssignedFilterChange,
  projects,
}) => {
  const activeFiltersCount = [statusFilter, priorityFilter, projectFilter, assignedFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusFilterChange('');
    onPriorityFilterChange('');
    onProjectFilterChange('');
    onAssignedFilterChange('');
  };

  return (
    <Card variant="glass" className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => onProjectFilterChange(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Assigned To Email Filter */}
        <input
          type="email"
          placeholder="Filter by email"
          value={assignedFilter}
          onChange={(e) => onAssignedFilterChange(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex flex-wrap gap-2">
            {statusFilter && (
              <Badge 
                variant="primary" 
                size="sm"
                className="cursor-pointer hover:bg-blue-200"
                onClick={() => onStatusFilterChange('')}
              >
                Status: {statusFilter} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {priorityFilter && (
              <Badge 
                variant="warning" 
                size="sm"
                className="cursor-pointer hover:bg-yellow-200"
                onClick={() => onPriorityFilterChange('')}
              >
                Priority: {priorityFilter} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {projectFilter && (
              <Badge 
                variant="secondary" 
                size="sm"
                className="cursor-pointer hover:bg-purple-200"
                onClick={() => onProjectFilterChange('')}
              >
                Project: {projects.find(p => p.id === projectFilter)?.name} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {assignedFilter && (
              <Badge 
                variant="glass" 
                size="sm"
                className="cursor-pointer hover:bg-white/30"
                onClick={() => onAssignedFilterChange('')}
              >
                Assigned: {assignedFilter} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};