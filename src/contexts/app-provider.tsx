"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, Task, TaskStatus, Theme } from '@/lib/types';
import { initialUsers, initialTasks } from '@/lib/data';
import { themes } from '@/lib/themes';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  user: User | null;
  users: User[];
  tasks: Task[];
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  signup: (email: string, password?: string) => boolean;
  updateUser: (updatedUser: User) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId' | 'status'>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [currentTheme, setCurrentThemeState] = useState<Theme>(themes[0]);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.style.setProperty('--background', currentTheme.colors.background);
    document.documentElement.style.setProperty('--foreground', currentTheme.colors.foreground);
    document.documentElement.style.setProperty('--card', currentTheme.colors.card);
    document.documentElement.style.setProperty('--primary', currentTheme.colors.primary);
    document.documentElement.style.setProperty('--accent', currentTheme.colors.accent);
    document.documentElement.style.setProperty('--border', currentTheme.colors.border);
    document.documentElement.style.setProperty('--input', currentTheme.colors.input);
    document.documentElement.style.setProperty('--ring', currentTheme.colors.ring);
  }, [currentTheme]);

  const login = useCallback((email: string) => {
    const foundUser = users.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      toast({ title: "Login Successful", description: `Welcome back, ${email}!` });
      return true;
    }
    toast({ variant: "destructive", title: "Login Failed", description: "User not found." });
    return false;
  }, [users, toast]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const signup = useCallback((email: string) => {
    if (users.some((u) => u.email === email)) {
      toast({ variant: "destructive", title: "Signup Failed", description: "Email already exists." });
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      isAdmin: false,
      coins: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    toast({ title: "Signup Successful", description: `Welcome, ${email}!` });
    return true;
  }, [users, toast]);
  
  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
    }
  }, [user]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'userId' | 'status'>) => {
    if (!user) return;
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: user.id,
      status: 'todo',
    };
    setTasks((prev) => [newTask, ...prev]);
  }, [user]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (task.status !== 'done' && status === 'done' && user) {
            const updatedUser = { ...user, coins: user.coins + 5 };
            setUser(updatedUser);
            setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
            toast({ title: "Task Completed!", description: "You earned 5 coins!" });
          }
          return { ...task, status };
        }
        return task;
      })
    );
  }, [user, toast]);

  const setCurrentTheme = useCallback((theme: Theme) => {
    setCurrentThemeState(theme);
  }, []);
  
  const value = {
    user,
    users,
    tasks,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    updateUser,
    addTask,
    deleteTask,
    updateTaskStatus,
    currentTheme,
    setCurrentTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
