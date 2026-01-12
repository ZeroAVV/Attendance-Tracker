import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/landing';
import Dashboard from './pages/Dashboard';
import Lectures from './pages/Lectures';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useAuth } from '@clerk/clerk-react';

function App() {
  const fetchData = useStore((state) => state.fetchData);
  const setUserId = useStore((state) => state.setUserId);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        setUserId(userId);
        fetchData();
      } else {
        setUserId(null);
      }
    }
  }, [userId, isLoaded, fetchData, setUserId]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" index element={<Dashboard />} />
        <Route path="lectures" element={<Lectures />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="stats" element={<Stats />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;