import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
  Clipboard,
  Lock,
  Bell,
  Users,
  Calendar,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Menu,
  X,
} from "lucide-react";

const API_BASE_URL = "https://taskmaster-g5n5.onrender.com";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-orange-500 shadow-md fixed top-0 left-0 right-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <span className="font-bold text-xl text-gray-800">
                    TaskMaster
                  </span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-transparent text-gray-800 hover:border-gray-300 hover:text-orange-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/tasks"
                  className="border-transparent text-gray-800 hover:border-gray-300 hover:text-orange-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tasks
                </Link>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-800 hover:bg-gray-800 hover:border-gray-300 hover:text-orange-400"
                >
                  Home
                </Link>
                <Link
                  to="/tasks"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-800 hover:bg-gray-800 hover:border-gray-300 hover:text-orange-400"
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
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              Conquer Your Tasks with TaskMaster
            </h1>
            <p className="text-xl mb-10">
              TaskMaster is a powerful task management solution that helps you
              stay organized, productive, and in control of your to-do list.
            </p>
            <button
              onClick={() => navigate("/tasks")}
              className="bg-orange-500 hover:bg-orange-600 text-gray-900 font-medium py-3 px-6 rounded-md flex items-center transition-colors duration-300"
            >
              Get Started
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              <Check className="text-orange-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Task Tracking</h3>
              <p className="text-gray-400">
                Stay on top of your tasks with our intuitive task tracking
                features.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              <Calendar className="text-orange-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Task Scheduling</h3>
              <p className="text-gray-400">
                Schedule tasks, set deadlines, and never miss a beat with our
                calendar integration.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              <Users className="text-orange-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-gray-400">
                Collaborate with your team, assign tasks, and stay in sync with
                ease.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              <Clipboard className="text-orange-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Advanced Reporting</h3>
              <p className="text-gray-400">
                Generate detailed reports, track progress, and optimize your
                workflows.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              <Bell className="text-orange-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Notifications</h3>
              <p className="text-gray-400">
                Stay on top of your tasks with customizable notifications and
                reminders.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              <Lock className="text-orange-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Security</h3>
              <p className="text-gray-400">
                Rest assured with our robust security features and data
                protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl pt-6 font-bold mb-6 text-white">
          Task Manager
        </h2>

        <form onSubmit={createTask} className="mb-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full p-2 border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <textarea
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full p-2 border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-orange-500 text-gray-900 p-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center justify-center"
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
              className="bg-gray-800 p-4 rounded-md shadow-md border border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`text-lg font-medium ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="mt-1 text-gray-400 text-sm">
                    {task.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateTaskStatus(task._id)}
                    className={`p-1 rounded-md ${
                      task.completed
                        ? "bg-gray-600 text-gray-400"
                        : "bg-green-500 text-gray-900 hover:bg-green-600"
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
    </div>
  );
};
export default App;
