import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { Check, Plus, Trash2, Menu, X } from "lucide-react";

const API_BASE_URL = "https://taskmaster-g5n5.onrender.com";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <span className="font-bold text-xl text-gray-900">
                    TaskMaster
                  </span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/tasks"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tasks
                </Link>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                >
                  Home
                </Link>
                <Link
                  to="/tasks"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                >
                  Tasks
                </Link>
              </div>
            </div>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tasks" element={<TaskManager />} />
        </Routes>
      </div>
    </Router>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-cyan-200 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-5xl font-bold mb-8 text-gray-900">
        Welcome to TaskMaster
      </h1>
      <p className="text-xl mb-8 text-center max-w-2xl text-gray-600">
        Streamline your productivity with our intuitive task management
        solution. Organize, prioritize, and conquer your to-do list with ease.
      </p>
      <button
        onClick={() => navigate("/tasks")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-lg transition duration-300"
      >
        Get Started
      </button>
    </div>
  );
};

const TaskManager = () => {
  const [tasks, setTasks] = React.useState([]);
  const [newTask, setNewTask] = React.useState({ title: "", description: "" });

  React.useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTasks(response.data.allTodos);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/newtodo`, newTask);
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTaskStatus = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/completed`, { id });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 ">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Task Manager</h2>

      <form onSubmit={createTask} className="mb-8">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <Plus className="mr-2" size={18} />
            Add Task
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-lg font-medium ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="mt-1 text-gray-600 text-sm">{task.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTaskStatus(task._id)}
                  className={`p-1 rounded-md ${
                    task.completed
                      ? "bg-gray-200 text-gray-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  } transition duration-300`}
                  aria-label={
                    task.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
