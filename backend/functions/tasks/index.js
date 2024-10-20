const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const { body, param, validationResult } = require("express-validator");
const cors = require("cors");

const expressApp = express();

// Allow requests from any origin
expressApp.use(cors());

// Middleware to parse JSON requests
expressApp.use(express.json());

// GET /tasks - Fetch all tasks
expressApp.get("/", async (req, res) => {
  try {
    console.log("Getting tasks");

    const app = catalyst.initialize(req);
    const dataStore = app.datastore();

    // Start fetching paged rows
    const dataFromDB = await getMyPagedRows(dataStore);

    res.status(200).json(dataFromDB);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
});

// Create a new task
expressApp.post(
  "/",
  [
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("description").isString().optional(),
    body("status").isString().optional(),
    body("dueDate").optional(),
    body("task_priority").isString().optional()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const app = catalyst.initialize(req);
      const datastore = app.datastore();
      const table = datastore.table("Tasks");

      // Create a new task
      const newTask = {}

      const { title, description, status, task_priority, dueDate } = req.body;

      if (title) {
        newTask.title = title;
      }

      if (description) {
        newTask.description = description;
      }

      if (status) {
        newTask.status = status;
      }

      if (task_priority) {
        newTask.task_priority = task_priority;
      }

      if (dueDate) {
        newTask.dueDate = dueDate;
      }

      console.log(`newTask :: ${JSON.stringify(newTask)}`);

      await table.insertRow(newTask);

      res.status(201).json({ message: "Task created successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create task." });
    }
  }
);

// PUT /tasks/:id - Update an existing task
expressApp.put(
  "/:id",
  [
    param("id").isNumeric().withMessage("Task ID must be numeric"),
    body("title").isString().optional(),
    body("description").isString().optional(),
    body("status").isString().optional(),
    body("dueDate").optional(),
    body("task_priority").isString().optional()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const app = catalyst.initialize(req);
      const datastore = app.datastore();
      const table = datastore.table("Tasks");

      const taskId = req.params.id;
      const updatedData = { ROWID: taskId };
      const { title, description, status, task_priority, dueDate } = req.body;

      if (title) {
        updatedData.title = title;
      }

      if (description) {
        updatedData.description = description;
      }

      if (status) {
        updatedData.status = status;
      }

      if (task_priority) {
        updatedData.task_priority = task_priority;
      }

      if (dueDate) {
        updatedData.dueDate = dueDate;
      }

      console.log(`Updated data : ${JSON.stringify(updatedData)}`);

      // Update the task
      await table.updateRow(updatedData);

      res.status(200).json({ message: "Task updated successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update task." });
    }
  }
);

// DELETE /tasks/:id - Delete a task
expressApp.delete(
  "/:id",
  [param("id").isNumeric().withMessage("Task ID must be numeric")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const app = catalyst.initialize(req);
      const datastore = app.datastore();
      const table = datastore.table("Tasks");

      const taskId = req.params.id;

      // Delete the task
      await table.deleteRow(taskId);

      res.status(200).json({ message: "Task deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete task." });
    }
  }
);

// Function to fetch rows from the 'Tasks' table through pagination
async function getMyPagedRows(
  dataStore,
  hasNext = true,
  nextToken = undefined,
  accumulatedData = [] // Array to accumulate the fetched data
) {
  if (!hasNext) {
    return accumulatedData; // Return the accumulated data when no more records
  }

  try {
    const table = dataStore.table("Tasks"); // Use the correct table name 'Tasks'

    // Fetch rows with pagination
    const { data, next_token, more_records } = await table.getPagedRows({
      nextToken,
      maxRows: 100, // Define the maximum rows to fetch in a single request
    });

    accumulatedData.push(...data); // Accumulate the fetched rows

    // Recursively fetch the next set of records if available
    return await getMyPagedRows(
      dataStore,
      more_records,
      next_token,
      accumulatedData
    );
  } catch (err) {
    console.error("Error fetching rows:", err.toString()); // Handle any errors
    throw err; // Rethrow the error for further handling if necessary
  }
}

// Export the Express app
module.exports = expressApp;
