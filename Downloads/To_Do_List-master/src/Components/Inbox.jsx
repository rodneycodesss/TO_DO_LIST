import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodoModal from "./modalWindow/TodoModal.jsx";

function Inbox({ currentUser, onAddTask }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Load tasks from localStorage on mount and when a new task is added
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks([]);
    }
  }, [isModalOpen]);

  // Add a new task and update localStorage
  const handleAddTask = (task) => {
    const updatedTasks = [...tasks, { ...task, id: Date.now() }];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    if (onAddTask) onAddTask(task);
  };

  const handleEditTask = (taskId) => {
    navigate('/Edit', { state: { id: taskId } });
  };

  const handleDeleteTask = (taskId, e) => {
    e.stopPropagation();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleCompleteTask = (taskId, e) => {
    e.stopPropagation();
    // Find the task to complete
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (!taskToComplete) return;
    // Remove from tasks
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    // Add to completed
    const completedTasks = JSON.parse(localStorage.getItem("completed")) || [];
    // Convert fields to match completed format if needed
    const completedTask = {
      ...taskToComplete,
      Date: taskToComplete.date,
      Title: taskToComplete.title,
      Description: taskToComplete.description || "",
    };
    localStorage.setItem("completed", JSON.stringify([...completedTasks, completedTask]));
  };

  const priority1Tasks = tasks.filter((task) => task.priority === 1);
  const otherTasks = tasks.filter((task) => task.priority !== 1);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl border border-gray-400 min-h-[80vh] bg-white shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-mono text-center w-full">Inbox <span className="mx-2">/</span> Today</div>
        <button
          className="ml-4 px-5 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Task
        </button>
      </div>
      <div className="mb-8">
        <div className="text-lg font-mono mb-2">Priority 1</div>
        {priority1Tasks.length === 0 ? (
          <div className="text-gray-400 italic">No Priority 1 tasks</div>
        ) : (
          priority1Tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 border rounded-xl mb-2 hover:shadow-md cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <input
                type="checkbox"
                className="w-6 h-6 accent-green-500"
                onClick={e => handleCompleteTask(task.id, e)}
                title="Mark as completed"
              />
              <div className="flex-1 flex gap-4">
                <div className="w-48 text-center border rounded bg-gray-100 py-1 font-mono">{task.date}</div>
                <div className="flex-1 text-center border rounded bg-gray-100 py-1 font-mono">{task.title}</div>
              </div>
              <button
                className="ml-4 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={e => { e.stopPropagation(); handleEditTask(task.id); }}
              >
                Edit
              </button>
              <button
                className="ml-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={e => handleDeleteTask(task.id, e)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      <div className="text-lg font-mono mb-2">Other Priorities</div>
      {otherTasks.length === 0 ? (
        <div className="text-gray-400 italic">No other tasks</div>
      ) : (
        otherTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 border rounded-xl mb-2 hover:shadow-md cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <input
              type="checkbox"
              className="w-6 h-6 accent-green-500"
              onClick={e => handleCompleteTask(task.id, e)}
              title="Mark as completed"
            />
            <div className="flex-1 flex gap-4">
              <div className="w-48 text-center border rounded bg-gray-100 py-1 font-mono">{task.date}</div>
              <div className="flex-1 text-center border rounded bg-gray-100 py-1 font-mono">{task.title}</div>
            </div>
            <button
              className="ml-4 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={e => { e.stopPropagation(); handleEditTask(task.id); }}
            >
              Edit
            </button>
            <button
              className="ml-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={e => handleDeleteTask(task.id, e)}
            >
              Delete
            </button>
          </div>
        ))
      )}
      <div className="mt-8 text-center">
        <button
          className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 font-semibold"
          onClick={() => navigate("/Completed")}
        >
          Go to Completed Tasks
        </button>
      </div>
      {/* Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedTask(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedTask.title}</h2>
            <div className="mb-2 text-gray-600 font-mono">Date: {selectedTask.date}</div>
            <div className="mb-4">{selectedTask.details}</div>
            <button
              className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
              onClick={() => setSelectedTask(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* TodoModal for adding a new task */}
      {isModalOpen && (
        <TodoModal
          isOpen={isModalOpen}
          onAddTask={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Inbox; 