import { Exam } from "@/lib/models";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamCardProps {
  exam: Exam;
  courseName?: string;
  courseColor?: string;
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => void;
}

export function ExamCard({ exam, courseName, courseColor, onEdit, onDelete }: ExamCardProps) {
  const daysRemaining = exam.daysRemaining();
  const isApproaching = exam.isApproaching();
  const examDate = new Date(exam.date);

  return (
    <Card className={cn(
      "p-4 transition-smooth hover:shadow-lg",
      isApproaching && "border-secondary border-2"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{courseName || 'Exam'}</h3>
            {isApproaching && (
              <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary">
                {daysRemaining > 0 ? `${daysRemaining} days left` : daysRemaining === 0 ? 'Today!' : 'Passed'}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(exam)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(exam.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{examDate.toLocaleDateString()} at {examDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{exam.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>Duration: {exam.duration}</span>
        </div>
      </div>

      {exam.notes && (
        <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-2">
          {exam.notes}
        </p>
      )}
    </Card>
  );
}
