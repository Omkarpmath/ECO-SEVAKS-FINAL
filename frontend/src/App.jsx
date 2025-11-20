import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="events" element={<EventsList />} />
        <Route path="event/:eventId" element={<EventDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Routes (Logged in Users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
        </Route>

        {/* Admin Routes (Admin Role Only) */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminPanel />} />
        </Route>

        {/* TODO: Add a 404 Not Found page */}
        <Route path="*" element={<Home />} /> 
      </Route>
    </Routes>
  );
}

export default App;