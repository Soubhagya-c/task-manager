import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";
import TaskList from "../components/TaskList";
import { showSuccess } from "../utils/toast";
import TaskDialog from "../components/TaskDialog";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  is_deleted: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get(
        `/tasks?page=${page}&limit=${limit}&status=${statusFilter}&includeDeleted=${includeDeleted}`
      );

      setTasks(res.data.data);
      setHasPreviousPage(res.data.hasPrev);
      setHasNextPage(res.data.hasNext);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, [page, statusFilter, includeDeleted]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await API.put(`/tasks/${editingTaskId}`, newTask);
      } else {
        await API.post("/tasks", newTask);
      }
      setNewTask({ title: "", description: "", status: "pending" });
      setEditingTaskId(null);
      setIsDialogOpen(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/tasks/${id}`);
      showSuccess("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setIsDialogOpen(true);
  };

  const handleRestore = async (id: number) => {
    try {
      await API.post(`/tasks/${id}/restore`);
      showSuccess("Task restored successfully");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        {user && (
          <div className="mb-4 p-4 bg-white rounded shadow">
            <h2 className="font-bold text-lg">Welcome, {user.name}</h2>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>

          <button
            onClick={() => {
              setEditingTaskId(null);
              setNewTask({ title: "", description: "", status: "pending" });
              setIsDialogOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
          />
          Include Deleted
        </label>
        </div>

        <TaskList
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPreviousPage}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${
                !hasPreviousPage
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page <span className="font-semibold">{page}</span>
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${
                !hasNextPage
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Next
          </button>
        </div>
      </div>
      {isDialogOpen && (
        <TaskDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleAddTask}
          newTask={newTask}
          setNewTask={setNewTask}
          editingTaskId={editingTaskId}
        />
      )}
    </div>
  );
};

export default Dashboard;
