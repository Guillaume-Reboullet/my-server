// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/Projects';
import Containers from './pages/Containers';
import SSL from './pages/SSL';
import Docs from './pages/Docs';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/containers" element={<Containers />} />
        <Route path="/ssl" element={<SSL />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
