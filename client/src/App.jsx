import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import About from './pages/About';
import WelcomePage from './pages/Welcome';
import Dashboard from './components/dashboard/Dashboard';
import Group from '../src/components/groups/Group.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/group/:groupId" element={<Group />} /> {/* <-- New route */}
    </Routes>
  );
}

export default App;
