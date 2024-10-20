// src/api/tasksApi.ts

const API_BASE_URL = 'https://task-manager-60033690497.development.catalystserverless.in/server';

// Function to get all tasks
export const fetchTasks = async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    return response.json();
};

// Function to create a new task
export const createTask = async (task: { title: string; description: string }) => {
    console.log(`Adding task :: ${JSON.stringify(task)}`);
    
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task),
    });

    // Return an object containing both the status and the parsed JSON
    const data = await response.json();
    return { ok: response.ok, data }; // Return both status and data
};


// Function to update a task
export const updateTask = async (id: number, task: { title: string; description: string, status: string, dueDate: string, task_priority: string}) => {
    console.log(`Invoking ${API_BASE_URL}/tasks/${id}`);
    console.log(`Updated data :: ${JSON.stringify(task)}`);
    
    
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    return response.json();
};

// Function to delete a task
export const deleteTask = async (id: number) => {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
    });
};
