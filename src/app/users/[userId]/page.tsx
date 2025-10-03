
"use client";
import { useParams } from 'next/navigation';
import { useAppContext } from '@/hooks/use-app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Milestone, Rocket, Circle, CheckCircle2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { TaskStatus } from '@/lib/types';

export default function UserStatusPage() {
    const { userId } = useParams();
    const { users, tasks } = useAppContext();

    const user = users.find(u => u.id === userId);
    
    const userTasks = tasks.filter(t => t.userId === userId).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    const completedTasks = userTasks.filter(t => t.status === 'done');
    const inProgressTasks = userTasks.filter(t => t.status === 'in-progress');
    const todoTasks = userTasks.filter(t => t.status === 'todo');

    const milestoneTasks = [...completedTasks, ...inProgressTasks, ...todoTasks];
    
    const contributions = new Map<string, number>();
    for (const task of completedTasks) {
        const date = format(new Date(task.dueDate), 'yyyy-MM-dd');
        contributions.set(date, (contributions.get(date) || 0) + 1);
    }
    const today = new Date();
    const days = Array.from({ length: 30 }).map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (29 - i));
        return format(date, 'yyyy-MM-dd');
    });

    const getContributionColor = (count: number) => {
        if (count > 8) return 'bg-primary';
        if (count > 5) return 'bg-primary/70';
        if (count > 2) return 'bg-primary/40';
        if (count > 0) return 'bg-primary/20';
        return 'bg-muted/50';
    };

    if (!user) {
        return <div className="text-center py-10">User not found.</div>;
    }

    const totalMilestones = milestoneTasks.length;
    const progressPercentage = totalMilestones > 0 ? (completedTasks.length / totalMilestones) * 100 : 0;

    const getMilestoneIcon = (status: TaskStatus) => {
        switch(status) {
            case 'done':
                return <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10"><CheckCircle2 className="h-4 w-4 text-primary-foreground p-0.5"/></div>;
            case 'in-progress':
                return <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-500 ring-4 ring-background z-10 animate-pulse"><Loader2 className="h-4 w-4 text-white p-0.5 animate-spin"/></div>;
            case 'todo':
                return <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-muted-foreground ring-4 ring-background z-10"><Circle className="h-4 w-4 text-muted p-0.5"/></div>;
        }
    };

    return (
        <div className="container py-8">
            <header className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <Avatar className="h-20 w-20 text-3xl">
                    <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold">{user.email}</h1>
                    <p className="text-muted-foreground">Public Activity</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Last 30 Days Contributions</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto pb-4">
                            <TooltipProvider>
                                <div className="flex gap-1">
                                    {days.map(day => {
                                        const count = contributions.get(day) || 0;
                                        return (
                                            <Tooltip key={day}>
                                                <TooltipTrigger asChild>
                                                    <div className={`w-4 h-4 rounded-sm ${getContributionColor(count)}`} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{count} tasks on {format(new Date(day), 'MMM d, yyyy')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </TooltipProvider>
                        </CardContent>
                    </Card>

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Milestone /> Task Milestones</CardTitle>
                            <CardDescription>A complete journey of your tasks.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {milestoneTasks.length > 0 ? (
                                <div className="relative w-full py-10">
                                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border rounded-full -translate-x-1/2">
                                        <div className="bg-primary rounded-full" style={{ height: `${progressPercentage}%` }}></div>
                                    </div>
                                    
                                    <ul className="relative space-y-8">
                                        {milestoneTasks.map((task, index) => (
                                            <li key={task.id} className="relative flex items-center justify-between w-full">
                                                <div className={`w-[calc(50%-2.5rem)] ${index % 2 === 0 ? 'text-right' : 'order-3 text-left'}`}>
                                                    <div className={`inline-block p-4 bg-card border rounded-lg shadow-sm max-w-sm text-left ${task.status !== 'done' ? 'border-dashed' : ''}`}>
                                                        <p className={`font-semibold ${task.status !== 'done' ? 'text-muted-foreground' : ''}`}>{task.name}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                                                            {task.status === 'done' ? `Completed: ${format(new Date(task.dueDate), 'MMM d, yyyy')}` : `Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                {getMilestoneIcon(task.status)}
                                                <div className={`w-8 h-px bg-border ${index % 2 === 0 ? '' : 'order-2'}`}></div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No tasks yet. Add a task to start your journey!</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total Tasks</span>
                                <span className="font-bold">{totalMilestones}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Completed</span>
                                <span className="font-bold">{completedTasks.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">In Progress</span>
                                <span className="font-bold">{inProgressTasks.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">To Do</span>
                                <span className="font-bold">{todoTasks.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Coins Earned</span>
                                <span className="font-bold">{user.coins}</span>
                            </div>
                             <div className="space-y-2 pt-2">
                                <span className="text-muted-foreground text-sm">Overall Progress</span>
                                <Progress value={progressPercentage} className="w-full h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
