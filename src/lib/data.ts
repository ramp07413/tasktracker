import type { User, Task } from './types';

export const initialUsers: User[] = [
  { id: 'user-1', email: 'admin@tasktrack.com', isAdmin: true, coins: 100 },
  { id: 'user-2', email: 'user@tasktrack.com', isAdmin: false, coins: 25 },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Design the new dashboard layout',
    description: 'Create mockups in Figma for the v2 dashboard.',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date().toISOString(),
    userId: 'user-1',
  },
  {
    id: 'task-2',
    name: 'Develop the authentication flow',
    description: 'Implement login and signup pages using Next.js.',
    status: 'todo',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date().toISOString(),
    userId: 'user-2',
  },
  {
    id: 'task-3',
    name: 'Write documentation for the API',
    description: 'Use Swagger to document all public API endpoints.',
    status: 'done',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'user-2',
  },
  {
    id: 'task-4',
    name: 'Review user feedback from last week',
    description: 'Go through all Intercom messages and create a summary report.',
    status: 'done',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'user-1',
  },
];

export const publicTasks: Omit<Task, 'userId'>[] = [
    {
        id: 'public-1',
        name: 'Community Garden Planting Day',
        description: 'Join us this Saturday to plant new flowers and vegetables in the community garden.',
        status: 'todo',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'public-2',
        name: 'Local Park Cleanup',
        description: 'Help us keep our local park clean and green. Bags and gloves will be provided.',
        status: 'todo',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'public-3',
        name: 'Open Source Documentation Sprint',
        description: 'Contribute to your favorite open source projects by improving their documentation.',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
]
