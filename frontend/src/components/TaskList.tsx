import React from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  is_deleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onRestore,
}) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded shadow flex justify-between items-center ${
            task.status === "completed" ? "bg-green-200" : "bg-white"
          }`}
        >
          <div>
            <h3 className="font-bold">{task.title}</h3>
            <p className={task.is_deleted ? "line-through text-gray-400" : ""}>
              {task.description}
            </p>
            <p>{task.status}</p>
          </div>
          <div className="space-x-2">
            {!task.is_deleted ? (
              <>
                <button
                  onClick={() => onEdit(task)}
                  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => onRestore(task.id)}
                className="bg-green-500 px-2 py-1 rounded hover:bg-green-600"
              >
                Restore
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
