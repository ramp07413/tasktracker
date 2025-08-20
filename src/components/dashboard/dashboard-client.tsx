"use client";

import { useMemo } from 'react';
import { useAppContext } from '@/hooks/use-app-context';
import { AddTask } from '@/components/dashboard/add-task';
import { TaskCard } from '@/components/dashboard/task-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, Clock, ListTodo } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Task } from '@/lib/types';
import { isToday, isYesterday } from 'date-fns';

export function DashboardClient() {
  const { user, tasks } = useAppContext();

  const userTasks = useMemo(() => tasks.filter(t => t.userId === user?.id), [tasks, user]);
  
  const todaysTasks = useMemo(() => userTasks.filter(t => isToday(new Date(t.dueDate))), [userTasks]);
  const yesterdaysCompletedTasks = useMemo(() => userTasks.filter(t => t.status === 'done' && isYesterday(new Date(t.dueDate))), [userTasks]);

  const progressData = useMemo(() => {
    const todo = userTasks.filter(t => t.status === 'todo').length;
    const inProgress = userTasks.filter(t => t.status === 'in-progress').length;
    const done = userTasks.filter(t => t.status === 'done').length;
    return [
      { name: 'To Do', value: todo, color: '#f87171' },
      { name: 'In Progress', value: inProgress, color: '#fbbf24' },
      { name: 'Done', value: done, color: '#4ade80' },
    ];
  }, [userTasks]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.email}!</h1>
          <p className="text-muted-foreground">Here&apos;s your task overview for today.</p>
        </div>
        <AddTask />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData[0].value}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData[1].value}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData[2].value}</div>
            </CardContent>
          </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Today&apos;s Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {todaysTasks.length > 0 ? (
                        todaysTasks.map((task: Task) => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No tasks due today. Add one!</p>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Check className="h-5 w-5" /> Yesterday&apos;s Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {yesterdaysCompletedTasks.length > 0 ? (
                        yesterdaysCompletedTasks.map((task: Task) => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No tasks were completed yesterday.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {progressData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
