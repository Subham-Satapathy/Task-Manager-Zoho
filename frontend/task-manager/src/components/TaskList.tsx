import { TaskItem } from './TaskItem';
import { Task } from '../types/types';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const TaskList = ({ tasks, onEditTask, onDeleteTask }: TaskListProps) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        return (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        );
      })}
    </div>
    
  );
};

export { TaskList };