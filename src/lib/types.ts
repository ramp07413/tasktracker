export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  coins: number;
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    accent: string;
    border: string;
    input: string;
    ring: string;
  };
}
