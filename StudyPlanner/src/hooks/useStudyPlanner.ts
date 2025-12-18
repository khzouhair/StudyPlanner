import { useState, useEffect, useCallback } from 'react';
import { Course, Task, Exam, TaskStatus } from '@/lib/models';
import { StorageManager } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

export function useStudyPlanner() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [settings, setSettings] = useState({ darkMode: false, reminders: true, accentColor: 'teal' });

  // Load data on mount
  useEffect(() => {
    const loadedCourses = StorageManager.getCourses().map(Course.fromJSON);
    const loadedTasks = StorageManager.getTasks().map(Task.fromJSON);
    const loadedExams = StorageManager.getExams().map(Exam.fromJSON);
    const loadedSettings = StorageManager.getSettings();

    setCourses(loadedCourses);
    setTasks(loadedTasks);
    setExams(loadedExams);
    setSettings(loadedSettings);
  }, []);

  // Save courses
  const saveCourse = useCallback((course: Course) => {
    setCourses(prev => {
      const exists = prev.find(c => c.id === course.id);
      const updated = exists 
        ? prev.map(c => c.id === course.id ? course : c)
        : [...prev, course];
      StorageManager.saveCourses(updated.map(c => c.toJSON()));
      return updated;
    });
    toast({ title: 'Success', description: 'Course saved successfully' });
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => {
      const updated = prev.filter(c => c.id !== id);
      StorageManager.saveCourses(updated.map(c => c.toJSON()));
      return updated;
    });
    toast({ title: 'Success', description: 'Course deleted successfully' });
  }, []);

  // Save tasks
  const saveTask = useCallback((task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      const updated = exists 
        ? prev.map(t => t.id === task.id ? task : t)
        : [...prev, task];
      StorageManager.saveTasks(updated.map(t => t.toJSON()));
      return updated;
    });
    toast({ title: 'Success', description: 'Task saved successfully' });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      StorageManager.saveTasks(updated.map(t => t.toJSON()));
      return updated;
    });
    toast({ title: 'Success', description: 'Task deleted successfully' });
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status } : t);
      StorageManager.saveTasks(updated.map(t => Task.fromJSON(t).toJSON()));
      return updated.map(Task.fromJSON);
    });
    toast({ title: 'Success', description: `Task marked as ${status}` });
  }, []);

  // Save exams
  const saveExam = useCallback((exam: Exam) => {
    setExams(prev => {
      const exists = prev.find(e => e.id === exam.id);
      const updated = exists 
        ? prev.map(e => e.id === exam.id ? exam : e)
        : [...prev, exam];
      StorageManager.saveExams(updated.map(e => e.toJSON()));
      return updated;
    });
    toast({ title: 'Success', description: 'Exam saved successfully' });
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams(prev => {
      const updated = prev.filter(e => e.id !== id);
      StorageManager.saveExams(updated.map(e => e.toJSON()));
      return updated;
    });
    toast({ title: 'Success', description: 'Exam deleted successfully' });
  }, []);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      StorageManager.saveSettings(updated);
      return updated;
    });
  }, []);

  const resetAll = useCallback(() => {
    StorageManager.resetAll();
    setCourses([]);
    setTasks([]);
    setExams([]);
    setSettings({ darkMode: false, reminders: true, accentColor: 'teal' });
    toast({ title: 'Success', description: 'All data has been reset' });
  }, []);

  return {
    courses,
    tasks,
    exams,
    settings,
    saveCourse,
    deleteCourse,
    saveTask,
    deleteTask,
    updateTaskStatus,
    saveExam,
    deleteExam,
    updateSettings,
    resetAll,
  };
}
