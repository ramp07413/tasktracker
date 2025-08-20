"use client";
import { useParams } from 'next/navigation';
import { useAppContext } from '@/hooks/use-app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Milestone, Rocket } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

export default function UserStatusPage() {
    const { userId } = useParams();
    const { users, tasks } = useAppContext();

    const user = users.find(u => u.id === userId);
    const userTasks = tasks.filter(t => t.userId === userId);
    const completedTasks = userTasks.filter(t => t.status === 'done').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const nextTodoTask = userTasks.filter(t => t.status === 'todo').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    
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

    const totalMilestones = completedTasks.length + (nextTodoTask ? 1 : 0);
    const progressPercentage = totalMilestones > 0 ? (completedTasks.length / totalMilestones) * 100 : 0;

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
                             {nextTodoTask && (
                                <CardDescription>Progress towards your next milestone.</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full py-10">
                                {/* Central Timeline */}
                                <div className="absolute left-1/2 top-0 h-full w-1 bg-border rounded-full">
                                     <div className="bg-primary rounded-full" style={{ height: `${progressPercentage}%` }}></div>
                                </div>
                                
                                <ul className="relative space-y-8">
                                    {completedTasks.map((task, index) => (
                                        <li key={task.id} className="relative flex items-center justify-center">
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10"></div>
                                            <div className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'order-1 text-right' : 'order-3 text-left'}`}>
                                                <div className="inline-block p-4 bg-card border rounded-lg shadow-sm max-w-sm text-left">
                                                    <p className="font-semibold">{task.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Completed: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-16 h-px bg-border order-2"></div>
                                        </li>
                                    ))}
                                     {nextTodoTask && (
                                        <li className="relative flex items-center justify-center">
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-muted-foreground ring-4 ring-background z-10 animate-pulse"></div>
                                            <div className={`w-[calc(50%-2rem)] ${completedTasks.length % 2 === 0 ? 'order-1 text-right' : 'order-3 text-left'}`}>
                                                 <div className="inline-block p-4 bg-card border border-dashed rounded-lg max-w-sm text-left">
                                                    <p className="font-semibold text-muted-foreground flex items-center gap-2">
                                                        <Rocket className="h-4 w-4"/>
                                                        Next Milestone: {nextTodoTask.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Due: {format(new Date(nextTodoTask.dueDate), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-16 h-px bg-border order-2"></div>
                                        </li>
                                    )}
                                </ul>
                            </div>
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
                                <span className="text-muted-foreground">Total Completed</span>
                                <span className="font-bold">{completedTasks.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Coins Earned</span>
                                <span className="font-bold">{user.coins}</span>
                            </div>
                             <div className="space-y-2">
                                <span className="text-muted-foreground text-sm">Milestone Progress</span>
                                <Progress value={progressPercentage} className="w-full h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
