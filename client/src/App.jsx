import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import About from './pages/About';
import WelcomePage from './pages/Welcome';
import Dashboard from './components/dashboard/Dashboard';
import Group from './components/groups/Group.jsx';
import Chatroom from './components/groups/ChatRoom.jsx'; 

function App() {
  // Ideally get username from auth context/local storage or pass as prop
  const username = localStorage.getItem('username') || 'Guest';

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/group/:groupId" element={<Group />} />
      <Route
        path="/group/:groupId/chat"
        element={<Chatroom username={username} />}
      />
    </Routes>
  );
}

export default App;
