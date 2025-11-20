import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Lectures from './pages/Lectures';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import { useEffect } from 'react';
import { useStore } from './store/useStore';

function App() {
  const fetchData = useStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="lectures" element={<Lectures />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="stats" element={<Stats />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
