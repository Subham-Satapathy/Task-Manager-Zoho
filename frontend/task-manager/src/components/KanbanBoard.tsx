// src/components/KanbanBoard.tsx
import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { TaskList } from './TaskList'; // Importing TaskList
import { Task } from '../types/types'; // Importing the Task type

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  if (!tasks || tasks.length === 0) {
    return <Typography>No tasks available</Typography>; // Provide feedback when no tasks are present
  }

  const tasksByStatus = {
    BLOCKED: tasks.filter((task) => task.status?.toUpperCase() === "BLOCKED"),
    "TO DO": tasks.filter((task) => task.status?.toUpperCase() === "TO DO"),
    "IN PROGRESS": tasks.filter((task) => task.status?.toUpperCase() === "PENDING"),
    COMPLETED: tasks.filter((task) => task.status?.toUpperCase() === "COMPLETED"),
  };
  

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f4f4f4" }}>
      <Grid container spacing={2}>
        {(Object.keys(tasksByStatus) as Array<keyof typeof tasksByStatus>).map(
          (status) => (
            <Grid item xs={12} md={6} lg={3} key={status}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "#f8f8f8",
                  borderRadius: "12px",
                  height: "calc(100vh - 120px)",
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    p: 1,
                    mb: 2,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#333",
                  }}
                >
                  {status} ({tasksByStatus[status].length})
                </Typography>
                <TaskList 
                  tasks={tasksByStatus[status]} 
                  onEditTask={onEditTask} 
                  onDeleteTask={onDeleteTask} 
                />
              </Paper>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default KanbanBoard;