import { useState } from 'react';
import { Exam, Course } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ExamCard } from '@/components/ExamCard';
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

interface ExamsProps {
  exams: Exam[];
  courses: Course[];
  onSave: (exam: Exam) => void;
  onDelete: (id: string) => void;
}

export default function Exams({ exams, courses, onSave, onDelete }: ExamsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    date: '',
    location: '',
    duration: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exam = new Exam(
      editingExam?.id || `exam_${Date.now()}`,
      formData.courseId,
      formData.date,
      formData.location,
      formData.duration,
      formData.notes
    );

    onSave(exam);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      date: '',
      location: '',
      duration: '',
      notes: '',
    });
    setEditingExam(null);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      courseId: exam.courseId,
      date: exam.date,
      location: exam.location,
      duration: exam.duration,
      notes: exam.notes,
    });
    setIsOpen(true);
  };

  const sortedExams = [...exams].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exams</h1>
          <p className="text-muted-foreground">Track your upcoming examinations</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Add Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="date">Exam Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Room 301, Main Building"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2 hours, 90 minutes"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Expected chapters, instructions, materials needed..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingExam ? 'Update Exam' : 'Add Exam'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedExams.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-12">
            No exams scheduled. Click "Add Exam" to get started!
          </p>
        ) : (
          sortedExams.map(exam => (
            <ExamCard
              key={exam.id}
              exam={exam}
              courseName={courses.find(c => c.id === exam.courseId)?.name}
              courseColor={courses.find(c => c.id === exam.courseId)?.color}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
