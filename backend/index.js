const express = require("express");
const cors = require("cors");
const { todo } = require("./db");
const { createTodo, updateTodo } = require("./types");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/newtodo", async function (req, res) {
  const createPayload = req.body;
  const parsedPayload = createTodo.safeParse(createPayload);

  if (!parsedPayload.success) {
    res.status(401).json({
      message: "You have given invalid inputs",
    });
    return;
  }

  try {
    await todo.create({
      title: createPayload.title,
      description: createPayload.description,
      completed: false,
    });
    res.json({
      message: "Todo Added Successfully",
    });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({
      message: "Error adding todo",
    });
  }
});

app.get("/todos", async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const allTodos = await todo.find().skip(skip).limit(limit);
    const totalTodos = await todo.countDocuments();
    res.json({
      allTodos,
      currentPage: page,
      totalPages: Math.ceil(totalTodos / limit),
      totalTodos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

app.put("/completed", async function (req, res) {
  const { id } = req.body;
  try {
    const task = await todo.findById(id); // Rename to 'task'
    if (!task) {
      return res.status(404).json({ message: "Todo not found" });
    }
    task.completed = !task.completed; // Toggle the completed status
    await task.save(); // Save the updated task
    res.json({ message: "Todo updated successfully", task });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Error updating todo" });
  }
});

app.delete("/todos/:id", async function (req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Todo ID is required" });
  }

  try {
    const deletedTodo = await todo.deleteOne({ _id: id });

    if (deletedTodo.deletedCount === 0) {
      res.status(404).json({ message: "Todo not found" });
    } else {
      res.status(200).json({ message: "Todo deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

app.listen(port, () => {
  console.log(`Port is listening to ${port}`);
});
