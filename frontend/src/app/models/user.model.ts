export interface User {
  id: number;
  full_name: string;
  email: string;
  department?: string | null;
  role?: string | null;
  created_at: string;
}

export interface UserCreate {
  full_name: string;
  email: string;
  department?: string | null;
  role?: string | null;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
  department?: string | null;
  role?: string | null;
}
