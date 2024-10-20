export interface Task {
  _id: number;
  title: string;
  description: string;
  dueDate: string;
  task_priority: string;
  status: string;
  ROWID?: number
}