import { Course, CourseColor } from "@/lib/models";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const colorClasses: Record<CourseColor, string> = {
  pink: "border-l-8 border-l-course-pink bg-course-pink/10",
  yellow: "border-l-8 border-l-course-yellow bg-course-yellow/10",
  blue: "border-l-8 border-l-course-blue bg-course-blue/10",
  green: "border-l-8 border-l-course-green bg-course-green/10",
  purple: "border-l-8 border-l-course-purple bg-course-purple/10",
  orange: "border-l-8 border-l-course-orange bg-course-orange/10",
};

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <Card className={cn("p-4 transition-smooth hover:shadow-lg", colorClasses[course.color])}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{course.name}</h3>
          <p className="text-sm text-muted-foreground">{course.instructor}</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(course)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(course.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {course.schedule.map((sched, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <Clock className="h-3 w-3" />
            <span className="capitalize">{sched.day}</span>
            <span className="text-muted-foreground">
              {sched.startTime} - {sched.endTime}
            </span>
          </div>
        ))}
      </div>

      {course.notes && (
        <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-2">
          {course.notes}
        </p>
      )}
    </Card>
  );
}
