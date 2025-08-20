"use client";

import { useState } from 'react';
import { useAppContext } from '@/hooks/use-app-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import { generateDescriptionAction } from '@/actions/generate-description';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';


export function AddTask() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { addTask } = useAppContext();
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
    if (!name) {
      toast({ variant: "destructive", title: "Task Name Required", description: "Please enter a task name first." });
      return;
    }
    setIsGenerating(true);
    const result = await generateDescriptionAction(name);
    if (result.description) {
      setDescription(result.description);
    } else if (result.error) {
       toast({ variant: "destructive", title: "AI Error", description: result.error });
    }
    setIsGenerating(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addTask({ 
        name, 
        description, 
        dueDate: new Date().toISOString()
    });
    setName('');
    setDescription('');
    setOpen(false);
    toast({ title: "Task Added", description: `"${name}" has been added to your list.` });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a new task</DialogTitle>
            <DialogDescription>
              What do you need to get done? Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Task Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Finalize project report"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="flex flex-col text-right gap-2 pt-2">
                 <Label htmlFor="description">
                    Description
                </Label>
                 <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isGenerating}>
                    {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    AI
                </Button>
              </div>

              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 min-h-[100px]"
                placeholder="Add more details about the task..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
