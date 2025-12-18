// Data models and classes

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type CourseColor = 'pink' | 'yellow' | 'blue' | 'green' | 'purple' | 'orange';

export interface Schedule {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export class Course {
  constructor(
    public id: string,
    public name: string,
    public instructor: string,
    public schedule: Schedule[],
    public color: CourseColor,
    public notes: string = ''
  ) {}

  static fromJSON(json: any): Course {
    return new Course(
      json.id,
      json.name,
      json.instructor,
      json.schedule,
      json.color,
      json.notes
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      instructor: this.instructor,
      schedule: this.schedule,
      color: this.color,
      notes: this.notes
    };
  }
}

export class Task {
  constructor(
    public id: string,
    public title: string,
    public courseId: string,
    public deadline: string,
    public priority: Priority,
    public status: TaskStatus,
    public description: string = ''
  ) {}

  static fromJSON(json: any): Task {
    return new Task(
      json.id,
      json.title,
      json.courseId,
      json.deadline,
      json.priority,
      json.status,
      json.description
    );
  }

  isUrgent(): boolean {
    const now = new Date();
    const deadlineDate = new Date(this.deadline);
    const hoursRemaining = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return this.priority === 'high' && hoursRemaining < 24 && hoursRemaining > 0;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      courseId: this.courseId,
      deadline: this.deadline,
      priority: this.priority,
      status: this.status,
      description: this.description
    };
  }
}

export class Exam {
  constructor(
    public id: string,
    public courseId: string,
    public date: string,
    public location: string,
    public duration: string,
    public notes: string = ''
  ) {}

  static fromJSON(json: any): Exam {
    return new Exam(
      json.id,
      json.courseId,
      json.date,
      json.location,
      json.duration,
      json.notes
    );
  }

  daysRemaining(): number {
    const now = new Date();
    const examDate = new Date(this.date);
    const diffTime = examDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isApproaching(): boolean {
    const days = this.daysRemaining();
    return days <= 7 && days >= 0;
  }

  toJSON() {
    return {
      id: this.id,
      courseId: this.courseId,
      date: this.date,
      location: this.location,
      duration: this.duration,
      notes: this.notes
    };
  }
}
