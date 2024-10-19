import TaskForm from "../components/TaskForm";
import { Task } from "../types/types";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Modal,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import MenuIcon from "@mui/icons-material/Menu";
import KanbanBoard from "../components/KanbanBoard";
import { fetchTasks } from '../api/tasksApi';

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false); // Track if editing
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null); // Track the task being edited
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false); // State for logout dialog

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Pending",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  // const token = localStorage.getItem("token");

  const loadTasks = async () => {
    try {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    } catch (error) {
      console.log(`error ocurred while loading tasks:: ${error}`);
      throw error
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Function to get tasks by status
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/"); // Redirect to login or home page
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        console.log('Deleted');
        
      } catch (err) {
        setError("Failed to delete task");
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditOpen = (task: Task) => {
    setNewTask(task);
    setEditingTaskId(task._id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "",
      status: "Pending",
    });
  };

  const resetForm = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "",
      status: "TO DO",
    });
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true); // Open logout confirmation dialog
  };

  const handleLogoutConfirm = () => {
    // localStorage.removeItem("token");
    navigate("/"); // Redirect to login or home page
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Responsive Navbar */}
      <nav>
        <input type="checkbox" id="check" />
        <label htmlFor="check" className="checkbtn">
          <MenuIcon />
        </label>
        <label className="logo">Task Manager</label>
        <ul>
          <li>
            <a
              href="#"
              onClick={() => {
                setModalOpen(true);
                setIsEditing(false);
              }}
            >
              Add New Task
            </a>
          </li>
          <li>
             <a href="#" onClick={handleLogoutClick}>Logout</a> {/* Open logout confirmation */}
           </li>
        </ul>
      </nav>

      {/* Modal for Adding or Editing Task */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <TaskForm
          initialTask={newTask}
          onSubmit={() => {
            resetForm(); // Close modal and reset form after submission.
            console.log('Calling loadTasks() after adding new Task');
            loadTasks() // Pass handleAddTask to update tasks
          }}
          onCancel={resetForm} 
          isEditing={isEditing} 
        />
      </Modal>

      {/* Render the Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onEditTask={handleEditOpen}
        onDeleteTask={handleDeleteTask}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Task saved successfully!"
      />

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} sx={{ '& .MuiPaper-root': { borderRadius: '16px' } }}>
         <DialogTitle>Confirm Logout</DialogTitle>
         <DialogContent>
           <Typography>Are you sure you want to log out?</Typography>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
             Cancel
           </Button>
           <Button onClick={handleLogoutConfirm} color="secondary">
             Logout
           </Button>
         </DialogActions>
       </Dialog>
    </Box>
  );
};

export { Dashboard };
