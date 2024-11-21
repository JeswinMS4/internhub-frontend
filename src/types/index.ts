export type UserRole = 'admin' | 'program_manager' | 'guide' | 'intern' | 'panel_member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  guide?: User;
  interns: User[];
  githubRepo?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}