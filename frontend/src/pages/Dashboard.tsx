import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';


interface Task {
  id: number;
  title: string;
  description: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };


  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  // Add new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        // UPDATE
        await API.put(`/tasks/${editingTaskId}`, newTask);
      } else {
        // CREATE
        await API.post('/tasks', newTask);
      }
      setNewTask({ title: '', description: '' });
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Update task
  const handleUpdate = async (task: Task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
    });
  };

  // Filtered tasks based on search
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        {/* User Profile */}
        {user && (
          <div className="mb-4 p-4 bg-white rounded shadow">
            <h2 className="font-bold text-lg">Welcome, {user.username}</h2>
            <p>Email: {user.email}</p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        
        {/* Search input */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* Add task form */}
        <form onSubmit={handleAddTask} className="flex flex-col mb-6">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="p-2 mb-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="p-2 mb-2 border rounded"
            required
          />
          <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
            {editingTaskId ? 'Edit' : 'Add'} Task
          </button>
        </form>

        {/* Task list */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-bold">{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(task)}
                  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;