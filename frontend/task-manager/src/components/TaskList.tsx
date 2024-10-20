import { TaskItem } from './TaskItem';
import { Task } from '../types/types';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const TaskList = ({ tasks, onEditTask, onDeleteTask }: TaskListProps) => {
  // Move handleDeleteTask function inside TaskList component
  const handleDeleteTask = async (taskId: number) => {
    onDeleteTask(taskId);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id} // Ensure _id exists on the Task type
          task={task}
          onEdit={onEditTask}
          onDelete={handleDeleteTask} // Pass the correct function here
        />
      ))}
    </div>
  );
};

export { TaskList };
