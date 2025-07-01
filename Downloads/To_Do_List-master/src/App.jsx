import { useState, useEffect } from 'react'
import Login from './Components/registration/Login';
import TodoModal from './Components/modalWindow/TodoModal';
import Inbox from './Components/Inbox';
import CompletedHome from './Components/Completed Tasks/CompletedHome';
import EditCompletedTask from './Components/Completed Tasks/EditCompletedTask';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const sampleData = [
  { id: 1, Date: "2024-06-01", Title: "Sample Completed Task 1" },
  { id: 2, Date: "2024-06-02", Title: "Sample Completed Task 2" }
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    // Load user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSetUser = (userData) => {
    setCurrentUser(userData);
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log(`User ${userData.email} processed.`);
    } else {
      localStorage.removeItem('currentUser');
      console.log("User logged out from App.");
    }
  };

  const handleSetUserRole = (role) => {
    setCurrentUserRole(role);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddTask = (newTaskData) => {
    const updatedTasks = [...tasks, { ...newTaskData, id: Date.now() }]; 
    console.log("Updated Tasks", updatedTasks);
    setTasks(updatedTasks);
    localStorage.setItem('completed', JSON.stringify(updatedTasks));
  };

  // localStorage.setItem("completed", JSON.stringify(sampleData));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUser={handleSetUser} setUserRole={handleSetUserRole} />} />
        <Route path="/Inbox" element={<Inbox currentUser={currentUser} onAddTask={handleAddTask} />} />
        <Route path="/Completed" element={<CompletedHome />} />
        <Route path="/Edit" element={<EditCompletedTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
