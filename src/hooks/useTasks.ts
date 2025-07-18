import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task, Project } from '../types';

export const useTasks = (userId?: string, userEmail?: string, role: 'admin' | 'user' = 'user') => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      let query = supabase.from('tasks').select(`*, project:projects(*)`);

      if (role === 'user' && userEmail) {
        query = query.eq('assigned_to', userEmail);
      } else if (role === 'admin' && userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [userId, userEmail, role]);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { assigned_to: string }) => {
    console.log('Creating task with role:', role, 'userId:', userId, 'task:', task); // Debug log
    if (role !== 'admin') throw new Error('Only admin can create tasks');
    if (!userId) throw new Error('No user ID');
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      await fetchTasks();
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!userId) throw new Error('No user ID');
    const task = tasks.find((t) => t.id === id);
    if (updates.status && task?.assigned_to === userEmail) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({ status: updates.status })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        await fetchTasks();
        return data;
      } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
      }
    }
    if (role !== 'admin') throw new Error('Only admin can update tasks');
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchTasks();
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (role !== 'admin') throw new Error('Only admin can delete tasks');
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const createProject = async (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (role !== 'admin') throw new Error('Only admin can create projects');
    if (!userId) throw new Error('No user ID');
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      await fetchProjects();
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), fetchProjects()]).finally(() => setLoading(false));
  }, [fetchTasks, fetchProjects]);

  return {
    tasks,
    projects,
    loading,
    createTask,
    updateTask,
    deleteTask,
    createProject,
    refetch: fetchTasks,
  };
};