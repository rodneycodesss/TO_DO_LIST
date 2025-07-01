import React, { useState, useEffect } from 'react';


function TodoModal({ isOpen, onAddTask, onClose }) {
  const initialTaskData = {
    title: '',
    description: '',
    date: '',
    label: ['work', {work: 'Work', personal: 'Personal', Education: 'Education', home: 'Home', other: 'Other'}],
    reminder: [10, {10: '10 Mins', 15: '15 Mins', 30: '30 Mins', 45: '45 Mins', 60: '60 Mins'}],
    labelArr: ['work', 'personal','Education', 'home', 'other'],
    reminderArr: [10,15,30,45,60],
    completed: false
  };

  const [taskData, setTaskData] = useState(initialTaskData);
  const [titleError, setTitleError] = useState('');
  
  // Reset 
  useEffect(() => {
    if (isOpen) {
      setTaskData(initialTaskData);
      setTitleError('');
    }
  }, [isOpen]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData({
      ...taskData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (name === 'title' && value.trim()) {
      setTitleError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      setTitleError('A title is required to save the task.');
      return;
    }
    onAddTask(taskData);
    onClose(); // Close modal
  };
  
  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const isSaveDisabled = !taskData.title.trim();

  return (
    // Main modal overlay with blurred background effect
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      
      {/* Modal content card with entrance animation */}
      <div className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-xl animate-fade-in-down">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Create a New Task</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="What needs to be done?"
              value={taskData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {titleError && <p className="mt-1 text-sm text-red-600">{titleError}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Details</label>
            <textarea
              id="description"
              name="description"
              placeholder="Add a description, notes, or links..."
              value={taskData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date & Label Fields */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" id="date" name="date" value={taskData.date} onChange={handleChange}
                     className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">Label</label>
              <input type="text" id="label" name="label" placeholder="e.g., #Work" value={taskData.label[0]} onChange={handleChange}
                     className="w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          
          {/* Custom Styled Checkbox */}
          <label htmlFor="completed" className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={taskData.completed}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </label>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaveDisabled}
              className={`px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoModal;

