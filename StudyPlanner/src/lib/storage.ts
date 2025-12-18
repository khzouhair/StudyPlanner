// LocalStorage manager class
export class StorageManager {
  private static COURSES_KEY = 'studyplanner_courses';
  private static TASKS_KEY = 'studyplanner_tasks';
  private static EXAMS_KEY = 'studyplanner_exams';
  private static SETTINGS_KEY = 'studyplanner_settings';

  static saveCourses(courses: any[]): void {
    localStorage.setItem(this.COURSES_KEY, JSON.stringify(courses));
  }

  static getCourses(): any[] {
    const data = localStorage.getItem(this.COURSES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveTasks(tasks: any[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  static getTasks(): any[] {
    const data = localStorage.getItem(this.TASKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveExams(exams: any[]): void {
    localStorage.setItem(this.EXAMS_KEY, JSON.stringify(exams));
  }

  static getExams(): any[] {
    const data = localStorage.getItem(this.EXAMS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveSettings(settings: any): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  static getSettings(): any {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : { darkMode: false, reminders: true, accentColor: 'teal' };
  }

  static resetAll(): void {
    localStorage.removeItem(this.COURSES_KEY);
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.EXAMS_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}
