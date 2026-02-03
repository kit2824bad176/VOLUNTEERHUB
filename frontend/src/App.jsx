import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import ActivityDetails from './pages/ActivityDetails';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
