import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useUsers = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_emails') // Changed from auth.users to user_emails
        .select('email')
        .order('email', { ascending: true });

      if (error) throw error;
      setUsers(data.map((user) => user.email) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading };
};