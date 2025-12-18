import { useState, useMemo } from 'react';
import { Task, Priority, TaskStatus, Course } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TasksProps {
  tasks: Task[];
  courses: Course[];
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function Tasks({ tasks, courses, onSave, onDelete, onStatusChange }: TasksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    deadline: '',
    priority: 'medium' as Priority,
    status: 'pending' as TaskStatus,
    description: '',
  });

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by deadline
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task = new Task(
      editingTask?.id || `task_${Date.now()}`,
      formData.title,
      formData.courseId,
      formData.deadline,
      formData.priority,
      formData.status,
      formData.description
    );

    onSave(task);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      courseId: '',
      deadline: '',
      priority: 'medium',
      status: 'pending',
      description: '',
    });
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      courseId: task.courseId,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      description: task.description,
    });
    setIsOpen(true);
  };

  const filterTasksByStatus = (status: TaskStatus) => {
    return sortedTasks.filter(t => t.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">Manage your homework and assignments</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="courseId">Course</Label>
                <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-6">
          {sortedTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No tasks yet. Click "Add Task" to get started!
            </p>
          ) : (
            sortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                courseName={courses.find(c => c.id === task.courseId)?.name}
                onEdit={handleEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-6">
          {filterTasksByStatus('pending').map(task => (
            <TaskCard
              key={task.id}
              task={task}
              courseName={courses.find(c => c.id === task.courseId)?.name}
              onEdit={handleEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-3 mt-6">
          {filterTasksByStatus('in-progress').map(task => (
            <TaskCard
              key={task.id}
              task={task}
              courseName={courses.find(c => c.id === task.courseId)?.name}
              onEdit={handleEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-6">
          {filterTasksByStatus('completed').map(task => (
            <TaskCard
              key={task.id}
              task={task}
              courseName={courses.find(c => c.id === task.courseId)?.name}
              onEdit={handleEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
