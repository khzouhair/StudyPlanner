import { useMemo } from 'react';
import { Course, Task, Exam } from '@/lib/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckSquare, GraduationCap, AlertCircle } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { ExamCard } from '@/components/ExamCard';

interface DashboardProps {
  courses: Course[];
  tasks: Task[];
  exams: Exam[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
  onTaskStatusChange: (id: string, status: any) => void;
}

export default function Dashboard({
  courses,
  tasks,
  exams,
  onEditTask,
  onDeleteTask,
  onEditExam,
  onDeleteExam,
  onTaskStatusChange,
}: DashboardProps) {
  const stats = useMemo(() => ({
    totalCourses: courses.length,
    pendingTasks: tasks.filter(t => t.status !== 'completed').length,
    upcomingExams: exams.filter(e => e.daysRemaining() >= 0).length,
    urgentTasks: tasks.filter(t => t.isUrgent() && t.status !== 'completed').length,
  }), [courses, tasks, exams]);

  const upcomingTasks = useMemo(() => 
    tasks
      .filter(t => t.status !== 'completed')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5),
    [tasks]
  );

  const upcomingExams = useMemo(() =>
    exams
      .filter(e => e.daysRemaining() >= 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3),
    [exams]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your study overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingExams}</div>
          </CardContent>
        </Card>

        <Card className={stats.urgentTasks > 0 ? "border-destructive" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.urgentTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No pending tasks</p>
            ) : (
              upcomingTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  courseName={courses.find(c => c.id === task.courseId)?.name}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onTaskStatusChange}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No upcoming exams</p>
            ) : (
              upcomingExams.map(exam => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  courseName={courses.find(c => c.id === exam.courseId)?.name}
                  onEdit={onEditExam}
                  onDelete={onDeleteExam}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
