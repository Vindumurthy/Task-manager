import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '../types';

type Role = 'admin' | 'user';

export const useAuth = (): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  role: Role | null;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user as User ?? null;
      setUser(currentUser);
      if (session) {
        console.log('JWT Token:', session.access_token); // Log the JWT token
      }
      if (currentUser) fetchUserRole(currentUser.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user as User ?? null;
        setUser(currentUser);
        if (session) {
          console.log('JWT Token:', session.access_token); // Log the JWT token on state change
        }
        if (currentUser) fetchUserRole(currentUser.id);
        else setRole(null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data?.role) {
      setRole(data.role as Role);
    } else {
      console.error('Error fetching user role', error);
      setRole('user'); // fallback
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setRole(null);
  };

  // Combine user and role into the returned user object
  const enrichedUser = user ? { ...user, role: role || 'user' } : null;

  return {
    user: enrichedUser,
    loading,
    role,
    signIn,
    signUp,
    signOut,
  };
};