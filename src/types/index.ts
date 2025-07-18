// types.ts
export interface User {
  id: string;
  email: string;
  role?: string; // Optional role, can be 'admin' or 'user'
  // Add other Supabase User properties as needed (e.g., from Supabase's User type)
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string; // Now explicitly text (email)
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  project_id?: string;
  user_id: string; // Added from schema update
  created_at: string;
  updated_at: string;
}

// types.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string; // Foreign key to profiles.id
  created_at: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
}