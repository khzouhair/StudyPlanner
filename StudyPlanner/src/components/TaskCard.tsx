import { Task, Priority, TaskStatus } from "@/lib/models";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  courseName?: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityColors: Record<Priority, string> = {
  high: "bg-priority-high/20 text-priority-high border-priority-high",
  medium: "bg-priority-medium/20 text-priority-medium border-priority-medium",
  low: "bg-priority-low/20 text-priority-low border-priority-low",
};

const statusColors: Record<TaskStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-secondary/20 text-secondary",
  completed: "bg-primary/20 text-primary",
};

export function TaskCard({ task, courseName, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const deadline = new Date(task.deadline);
  const isOverdue = deadline < new Date() && task.status !== 'completed';

  return (
    <Card className={cn(
      "p-4 transition-smooth hover:shadow-lg",
      task.status === 'completed' && "opacity-70"
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold",
              task.status === 'completed' && "line-through"
            )}>
              {task.title}
            </h3>
            <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
          </div>
          {courseName && (
            <p className="text-sm text-muted-foreground">{courseName}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm mb-2">
        <Clock className={cn("h-4 w-4", isOverdue && "text-destructive")} />
        <span className={cn(isOverdue && "text-destructive font-semibold")}>
          {deadline.toLocaleString()}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <Badge className={statusColors[task.status]}>
          {task.status.replace('-', ' ')}
        </Badge>
        
        {task.status !== 'completed' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStatusChange(task.id, 'completed')}
            className="h-8 text-primary hover:text-primary"
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Mark Complete
          </Button>
        )}
      </div>
    </Card>
  );
}
