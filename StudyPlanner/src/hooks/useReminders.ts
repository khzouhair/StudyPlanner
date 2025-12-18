import { useEffect } from 'react';
import { Course, Task, Exam } from '@/lib/models';
import { toast } from '@/hooks/use-toast';

export function useReminders(
  courses: Course[],
  tasks: Task[],
  exams: Exam[],
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const checkReminders = () => {
      const now = new Date();

      // Check urgent tasks
      tasks.forEach(task => {
        if (task.isUrgent() && task.status !== 'completed') {
          toast({
            title: '⚠️ Urgent Task!',
            description: `"${task.title}" is due in less than 24 hours!`,
            variant: 'destructive',
          });
        }
      });

      // Check approaching exams
      exams.forEach(exam => {
        const daysRemaining = exam.daysRemaining();
        if (daysRemaining <= 3 && daysRemaining >= 0) {
          const course = courses.find(c => c.id === exam.courseId);
          toast({
            title: '📚 Exam Approaching!',
            description: `${course?.name || 'Exam'} in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}!`,
          });
        }
      });

      // Check upcoming courses (within 1 hour)
      courses.forEach(course => {
        course.schedule.forEach(sched => {
          const [hours, minutes] = sched.startTime.split(':').map(Number);
          const scheduleTime = new Date(now);
          scheduleTime.setHours(hours, minutes, 0, 0);
          
          const timeDiff = scheduleTime.getTime() - now.getTime();
          const minutesUntil = Math.floor(timeDiff / (1000 * 60));

          // Notify 15 minutes before class
          if (minutesUntil === 15) {
            toast({
              title: '🎓 Class Starting Soon!',
              description: `${course.name} starts in 15 minutes`,
            });
          }
        });
      });
    };

    // Check every 30 seconds
    const interval = setInterval(checkReminders, 30000);
    
    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, [courses, tasks, exams, enabled]);
}
