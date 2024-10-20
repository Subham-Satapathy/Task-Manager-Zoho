import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { Task } from "../types/types";
import { createTask, updateTask } from "../api/tasksApi"; // Import API functions

interface TaskFormProps {
  initialTask?: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [task, setTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    dueDate: "",
    task_priority: "",
    status: "TO DO",
    ...initialTask,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTask = async () => {
    setLoading(true);
    try {
      if(task?.ROWID){
        await updateTask(task.ROWID, task as Task);
        console.log("Edited");
      }else{
        setError('Invalid parameter to update')
      }
      setSnackbarMessage("Task updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      setError("Failed to update task");
      setSnackbarMessage("Failed to update task");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!task.title) {
      console.log("title not found");
      setError("Title is required.");
      setSnackbarMessage("Title is required.");
      setSnackbarOpen(true);
      return; // Early return if validation fails
    }
    setLoading(true);
    try {
      const response = await createTask(task as Task);
      console.log(`response status : ${JSON.stringify(response.data)}`);

      if (response.ok) {
        setSnackbarMessage("Task added successfully!");
        onSubmit(response.data); // Pass newly created task back to Dashboard
      } else {
        setError("Failed to add task");
        setSnackbarMessage("Failed to add task");
      }
    } catch (error) {
      setError("Failed to add task");
      setSnackbarMessage("Failed to add task");
      throw error;
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage(""); // Clear the message
    setError(null); // Reset error state
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#fff",
        margin: "10% auto",
        width: "400px",
        boxShadow: 24,
        borderRadius: "12px",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        {isEditing ? "Edit Task" : "Add New Task"}
      </Typography>

      <TextField
        label="Title"
        name="title"
        fullWidth
        variant="outlined"
        value={task.title}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
        error={!!error} // Highlight field if there's an error
      />
      <TextField
        label="Description"
        name="description"
        value={task.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Due Date"
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        fullWidth
        required
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth>
        <InputLabel>task_priority</InputLabel>
        <Select
          name="task_priority"
          value={task.task_priority}
          onChange={handleSelectChange}
          label="task_priority"
          required
          sx={{ mb: 2 }}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={task.status}
          onChange={handleSelectChange}
          label="Status"
          required
        >
          <MenuItem value="TO DO">To Do</MenuItem>
          <MenuItem value="IN PROGRESS">In Progress</MenuItem>
          <MenuItem value="BLOCKED">Blocked</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={isEditing ? handleEditTask : handleAddTask}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Add Task"
          )}
        </Button>
        <Button variant="outlined" onClick={onCancel} sx={{ marginLeft: 1 }}>
          Cancel
        </Button>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage} // Show dynamic message
      />
    </Box>
  );
};

export default TaskForm;
