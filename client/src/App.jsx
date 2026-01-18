import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageSkills from './pages/admin/ManageSkills';
import ManageExperience from './pages/admin/ManageExperience';
import ManageProfile from './pages/admin/ManageProfile';
import Messages from './pages/admin/Messages';

// Layout
import Layout from './layout/Layout';
import AdminLayout from './layout/AdminLayout';

function App() {
    const { user, loading } = useAuth();

    if (loading) return <div className="h-screen w-full flex items-center justify-center bg-dark text-white">Loading...</div>;

    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={!user ? <Login /> : <Navigate to="/admin" />} />

            <Route path="/admin" element={user ? <AdminLayout /> : <Navigate to="/admin/login" />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="skills" element={<ManageSkills />} />
                <Route path="experience" element={<ManageExperience />} />
                <Route path="profile" element={<ManageProfile />} />
                <Route path="messages" element={<Messages />} />
            </Route>
        </Routes>
    );
}

export default App;
