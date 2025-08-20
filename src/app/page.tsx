import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Users } from 'lucide-react';
import { publicTasks } from '@/lib/data';

export default function PublicPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            TaskTrack Daily
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container text-center py-20 sm:py-32">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Achieve More, Stress Less
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Welcome to TaskTrack Daily. Here are some of our public initiatives and community tasks. Join us to manage your own tasks!
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </section>

        <section className="container pb-20 sm:pb-32">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Public Community Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {publicTasks.map((task) => (
                  <li key={task.id} className="p-4 bg-background rounded-lg border flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{task.name}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="text-sm font-medium text-primary py-1 px-3 rounded-full bg-primary/10">
                      Community Goal
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

       <footer className="border-t">
        <div className="container py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} TaskTrack Daily. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
