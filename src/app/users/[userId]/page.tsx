"use client";
import { useParams } from 'next/navigation';
import { useAppContext } from '@/hooks/use-app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, GitCommit, Milestone } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        const date = addDays(today, -179 + i);
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

    const sortedTasks = [...userTasks].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    return (
        <div className="container py-8">
            <header className="flex items-center gap-4 mb-8">
                <Avatar className="h-20 w-20 text-3xl">
                    <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
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
                        <CardContent>
                            <TooltipProvider>
                                <div className="grid grid-rows-7 grid-flow-col gap-1">
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
                            <ul className="space-y-6">
                                {sortedTasks.map(task => (
                                    <li key={task.id} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                                                <GitCommit className="h-5 w-5" />
                                            </div>
                                            <div className="w-px h-full bg-border mt-2"></div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{task.name}</p>
                                            <p className="text-sm text-muted-foreground">{task.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Completed on {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
