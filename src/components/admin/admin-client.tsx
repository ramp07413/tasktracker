"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/hooks/use-app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Shield, Users, Palette, ExternalLink } from 'lucide-react';
import { themes } from '@/lib/themes';

export function AdminClient() {
  const { user, users, updateUser } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  if (!user?.isAdmin) {
    return <p className="text-center">Access Denied. Redirecting...</p>;
  }
  
  const toggleAdmin = (userId: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if(userToUpdate) {
        updateUser({...userToUpdate, isAdmin: !userToUpdate.isAdmin});
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and application settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> User Management</CardTitle>
          <CardDescription>View and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Coins</TableHead>
                <TableHead>Public Profile</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.isAdmin ? 'default' : 'secondary'}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.coins}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/users/${u.id}`}>
                        View <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleAdmin(u.id)} disabled={u.id === user.id}>
                        <Shield className="mr-2 h-4 w-4"/>
                        {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Theme Management</CardTitle>
          <CardDescription>Overview of available application themes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map(theme => (
                <div key={theme.name} className="border rounded-lg p-4">
                    <p className="font-semibold mb-2">{theme.name}</p>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full" style={{backgroundColor: `hsl(${theme.colors.primary})`}} title="Primary"></div>
                        <div className="w-6 h-6 rounded-full" style={{backgroundColor: `hsl(${theme.colors.accent})`}} title="Accent"></div>
                        <div className="w-6 h-6 rounded-full" style={{backgroundColor: `hsl(${theme.colors.card})`, border: `1px solid hsl(${theme.colors.border})`}} title="Card"></div>
                        <div className="w-6 h-6 rounded-full" style={{backgroundColor: `hsl(${theme.colors.background})`, border: `1px solid hsl(${theme.colors.border})`}} title="Background"></div>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
