import { useState } from 'react';
import { Course, CourseColor, DayOfWeek, Schedule } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
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

interface CoursesProps {
  courses: Course[];
  onSave: (course: Course) => void;
  onDelete: (id: string) => void;
}

export default function Courses({ courses, onSave, onDelete }: CoursesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    color: 'blue' as CourseColor,
    notes: '',
    day: 'monday' as DayOfWeek,
    startTime: '09:00',
    endTime: '10:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule: Schedule[] = [{
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
    }];

    const course = new Course(
      editingCourse?.id || `course_${Date.now()}`,
      formData.name,
      formData.instructor,
      schedule,
      formData.color,
      formData.notes
    );

    onSave(course);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      instructor: '',
      color: 'blue',
      notes: '',
      day: 'monday',
      startTime: '09:00',
      endTime: '10:00',
    });
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      instructor: course.instructor,
      color: course.color,
      notes: course.notes,
      day: course.schedule[0]?.day || 'monday',
      startTime: course.schedule[0]?.startTime || '09:00',
      endTime: course.schedule[0]?.endTime || '10:00',
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">Manage your course schedule</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="day">Day</Label>
                  <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value as DayOfWeek })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <SelectItem key={day} value={day} className="capitalize">{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="color">Color Label</Label>
                <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value as CourseColor })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['pink', 'yellow', 'blue', 'green', 'purple', 'orange'].map(color => (
                      <SelectItem key={color} value={color} className="capitalize">{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCourse ? 'Update Course' : 'Add Course'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-12">
            No courses yet. Click "Add Course" to get started!
          </p>
        ) : (
          courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
