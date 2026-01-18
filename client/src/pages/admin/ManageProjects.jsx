import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X } from 'lucide-react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        techStack: '', // Comma separated
        liveLink: '',
        githubLink: '',
        images: '' // Comma separated URLs
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/projects');
            setProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            techStack: formData.techStack.split(',').map(s => s.trim()),
            images: formData.images.split(',').map(s => s.trim())
        };

        try {
            if (isEditing) {
                await axios.put(`/projects/${currentId}`, payload);
            } else {
                await axios.post('/projects', payload);
            }

            resetForm();
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert('Error saving project');
        }
    };

    const handleEdit = (project) => {
        setCurrentId(project.id);
        setIsEditing(true);
        setFormData({
            title: project.title,
            description: project.description,
            techStack: project.techStack.join(', '),
            liveLink: project.liveLink || '',
            githubLink: project.githubLink || '',
            images: project.images.join(', ')
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`/projects/${id}`);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: '', description: '', techStack: '', liveLink: '', githubLink: '', images: ''
        });
    };

    const inputClasses = "w-full bg-dark border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors placeholder-slate-500";
    const btnClasses = "px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Projects</h1>

            <div className="glass-card p-6 mb-12">
                <h2 className="text-xl font-bold mb-4 border-b border-glass-border pb-4">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required className={inputClasses} />
                        <input name="techStack" placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <textarea name="description" placeholder="Project Description" value={formData.description} onChange={handleChange} required className={`${inputClasses} min-h-[120px]`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="liveLink" placeholder="Live Demo URL" value={formData.liveLink} onChange={handleChange} className={inputClasses} />
                        <input name="githubLink" placeholder="GitHub Repo URL" value={formData.githubLink} onChange={handleChange} className={inputClasses} />
                    </div>
                    <input name="images" placeholder="Image URLs (comma separated)" value={formData.images} onChange={handleChange} className={inputClasses} />

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className={`${btnClasses} bg-primary hover:bg-indigo-600 text-white`}>
                            {isEditing ? <Edit size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Update Project' : 'Add Project'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className={`${btnClasses} bg-white/10 hover:bg-white/20 text-white`}>
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 className="text-xl font-bold mb-4">Existing Projects ({projects.length})</h2>
            <div className="grid grid-cols-1 gap-4">
                {projects.map(p => (
                    <div key={p.id} className="glass-card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-glass-border/80 transition-colors">
                        <div className="flex gap-4 items-center">
                            {p.images[0] && <img src={p.images[0]} alt="" className="w-16 h-16 rounded object-cover bg-dark" />}
                            <div>
                                <h3 className="font-bold text-lg text-white">{p.title}</h3>
                                <p className="text-slate-400 text-sm max-w-xl truncate">{p.description}</p>
                                <div className="text-xs text-slate-500 mt-1">{p.techStack.join(' • ')}</div>
                            </div>
                        </div>
                        <div className="flex gap-2 self-end md:self-auto">
                            <button onClick={() => handleEdit(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors" title="Edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManageProjects;
