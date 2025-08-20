"use client";
import { useParams } from 'next/navigation';
import { useAppContext } from '@/hooks/use-app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, GitCommit, Milestone } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function UserStatusPage() {
    const { userId } = useParams();
    const { users, tasks } = useAppContext();

    const user = users.find(u => u.id === userId);
    const userTasks = tasks.filter(t => t.userId === userId && t.status === 'done');

    const contributions = new Map<string, number>();
    for (const task of userTasks) {
        const date = format(new Date(task.dueDate), 'yyyy-MM-dd');
        contributions.set(date, (contributions.get(date) || 0) + 1);
    }
    const today = new Date();
    const days = Array.from({ length: 180 }).map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (179 - i));
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

    const sortedTasks = [...userTasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

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
                            <CardTitle>Contribution Graph</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto pb-4">
                            <TooltipProvider>
                                <div className="grid grid-rows-7 grid-flow-col gap-1 min-w-[600px]">
                                    {days.map(day => {
                                        const count = contributions.get(day) || 0;
                                        return (
                                            <Tooltip key={day}>
                                                <TooltipTrigger asChild>
                                                    <div className={`w-3.5 h-3.5 rounded-sm ${getContributionColor(count)}`} />
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
                            <CardTitle className="flex items-center gap-2"><Milestone /> Completed Task Milestones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <div className="absolute left-1/2 top-0 h-full w-px bg-border -translate-x-1/2"></div>
                                <ul className="space-y-2">
                                    {sortedTasks.map((task, index) => (
                                        <li key={task.id} className="flex items-center w-full group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                            <div className={cn("w-1/2 flex", index % 2 === 0 ? "justify-end pr-8" : "justify-start pl-8 order-3")}>
                                                <div className="p-4 bg-card border rounded-lg shadow-sm w-full transition-transform duration-300 group-hover:scale-105">
                                                    <p className="font-semibold">{task.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10 flex-shrink-0 order-2">
                                                <div className="w-3 h-3 bg-primary-foreground rounded-full animate-pulse"></div>
                                            </div>
                                        </li>
                                    ))}
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
                                <span className="font-bold">{userTasks.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Coins Earned</span>
                                <span className="font-bold">{user.coins}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
