import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate('/admin');
        } catch (err) {
            console.error("Login Error Details:", err);
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-darker px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            <div className="max-w-md w-full glass-card p-8 md:p-10 relative z-10 shadow-2xl">
                <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
                <p className="text-slate-400 text-center mb-8">Sign in to manage your portfolio</p>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full bg-dark/50 border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full bg-dark/50 border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-indigo-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Login;
