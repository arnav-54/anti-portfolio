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

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-light text-darker">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25 animate-pulse mb-4">
                    A
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-secondary">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Loading Experience...</span>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={!user ? <Login /> : <Navigate to="/admin" />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={user ? <AdminLayout /> : <Navigate to="/admin/login" />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="skills" element={<ManageSkills />} />
                <Route path="experience" element={<ManageExperience />} />
                <Route path="profile" element={<ManageProfile />} />
                <Route path="messages" element={<Messages />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
