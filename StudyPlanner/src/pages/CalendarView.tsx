import { useMemo } from 'react';
import { Course, Task, Exam } from '@/lib/models';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CalendarViewProps {
  courses: Course[];
  tasks: Task[];
  exams: Exam[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

export default function CalendarView({ courses, tasks, exams }: CalendarViewProps) {
  const today = useMemo(() => new Date(), []);

  const getCoursesForDay = (day: string) => {
    return courses.filter(course => 
      course.schedule.some(s => s.day.toLowerCase() === day.toLowerCase())
    );
  };

  const getTasksForDay = (day: string) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      const dayIndex = DAYS.findIndex(d => d.toLowerCase() === day.toLowerCase());
      return taskDate.getDay() === (dayIndex + 1) % 7;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Weekly Calendar</h1>
        <p className="text-muted-foreground">Your schedule at a glance</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="font-semibold text-sm text-muted-foreground">Time</div>
            {DAYS.map(day => (
              <div key={day} className="font-semibold text-center">
                <div>{day}</div>
                <div className="text-xs text-muted-foreground">
                  {getCoursesForDay(day).length} classes
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="space-y-2">
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-2">
                <div className="text-sm text-muted-foreground py-2">
                  {hour}:00
                </div>
                {DAYS.map(day => {
                  const dayCourses = getCoursesForDay(day).filter(course => {
                    const schedule = course.schedule.find(s => 
                      s.day.toLowerCase() === day.toLowerCase()
                    );
                    if (!schedule) return false;
                    const startHour = parseInt(schedule.startTime.split(':')[0]);
                    return startHour === hour;
                  });

                  return (
                    <div key={`${day}-${hour}`} className="min-h-[60px]">
                      {dayCourses.map(course => {
                        const schedule = course.schedule.find(s => 
                          s.day.toLowerCase() === day.toLowerCase()
                        );
                        return (
                          <Card 
                            key={course.id}
                            className={cn(
                              "p-2 h-full transition-smooth hover:shadow-md",
                              `bg-course-${course.color}/30 border-l-4 border-l-course-${course.color}`
                            )}
                          >
                            <div className="font-semibold text-sm">{course.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {schedule?.startTime} - {schedule?.endTime}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Daily Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-7 gap-4">
            {DAYS.map(day => {
              const dayCourses = getCoursesForDay(day);
              const dayTasks = getTasksForDay(day);
              
              return (
                <Card key={day} className="p-4">
                  <h3 className="font-semibold mb-2">{day}</h3>
                  
                  {dayCourses.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Classes:</p>
                      <div className="space-y-1">
                        {dayCourses.map(course => (
                          <div key={course.id} className="text-xs">
                            {course.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dayTasks.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Tasks:</p>
                      <div className="space-y-1">
                        {dayTasks.map(task => (
                          <div key={task.id} className="text-xs">
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dayCourses.length === 0 && dayTasks.length === 0 && (
                    <p className="text-xs text-muted-foreground">No events</p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
