import { useState } from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import {Task} from '../types/types'
import {
  Typography,
  IconButton,
  Box,
  Card
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  
  const getPriorityColor = (task_priority: string) => {
    
    switch (task_priority ? task_priority.toLowerCase(): 'low') {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return '#4caf50';
    }
  };

  const getDueDate = () => {
    const dueDate = task.dueDate;
    if(dueDate){
      const parsedDueDate = new Date(dueDate);
      const currentDate = new Date();
      const timeDifference = parsedDueDate.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
      if (daysRemaining < 0) return 'Overdue';
      if (daysRemaining === 0) return 'Due Today';
      return `Due in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
    }else{
      return ''
    }
  };

  const handleEditOpen = (task: Task) => {
    console.log('Edited');
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      console.log('Deleted');
    }
  };

  return (
    <Card
      sx={{
        padding: "16px",
        marginBottom: "16px",
        boxShadow: 2,
        borderRadius: "8px",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.2rem",
            color: "#333",
            letterSpacing: "0.5px",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.title}
        </Typography>
        <Box
          component="span"
          sx={{
            marginLeft: "10px",
            padding: "2px 8px",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.75rem",
            backgroundColor: getPriorityColor(task?.task_priority)
          }}
        >
          {task.task_priority ?? 'Low'}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{
          marginTop: "8px",
          color: "#666",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "40px",
        }}
      >
        {task.description}
      </Typography>

      <Box
        sx={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ color: "#757575" }}>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#757575",
            marginLeft: "8px", // Add some spacing
          }}
        >
          {getDueDate()}
        </Typography>
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditOpen(task)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteTask(task._id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export {TaskItem};
