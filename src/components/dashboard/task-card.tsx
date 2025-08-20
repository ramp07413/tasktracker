"use client";

import { useState } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { useAppContext } from '@/hooks/use-app-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';

interface TaskCardProps {
  task: Task;
}

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
  'in-progress': 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600',
  done: 'bg-primary/10 border-primary/20 text-primary',
};

export function TaskCard({ task }: TaskCardProps) {
  const { deleteTask, updateTaskStatus } = useAppContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.status === 'done');

  const handleStatusChange = (newStatus: TaskStatus) => {
    const wasCompleted = task.status === 'done';
    const isNowCompleted = newStatus === 'done';
    updateTaskStatus(task.id, newStatus);

    if (!wasCompleted && isNowCompleted) {
        setIsCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
    } else {
        setIsCompleted(isNowCompleted);
    }
  }

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} onConfettiComplete={() => setShowConfetti(false)} />}
      <Card 
        className={cn(
            "transition-all duration-300",
            isCompleted ? "animate-task-complete" : ""
        )}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{task.name}</CardTitle>
              <span className={cn(
                'px-2 py-1 text-xs font-semibold rounded-full capitalize border',
                statusStyles[task.status]
              )}>
                  {task.status.replace('-', ' ')}
              </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select
              value={task.status}
              onValueChange={handleStatusChange}
              >
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
              </SelectContent>
              </Select>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTask(task.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  );
}
