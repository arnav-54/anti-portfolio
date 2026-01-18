import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Briefcase } from 'lucide-react';

const ManageExperience = () => {
    const [experiences, setExperiences] = useState([]);
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        duration: '',
        description: '',
        current: false
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const { data } = await axios.get('/experience');
            setExperiences(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/experience', formData);
            setFormData({ role: '', company: '', duration: '', description: '', current: false });
            fetchExperiences();
        } catch (err) { alert('Error adding experience'); }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete experience?')) {
            try {
                await axios.delete(`/experience/${id}`);
                fetchExperiences();
            } catch (err) { console.error(err); }
        }
    };

    const inputClasses = "w-full bg-dark border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors";

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Experience</h1>

            <div className="glass-card p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase size={20} /> Add New Experience</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">Role</label>
                            <input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className={inputClasses} required placeholder="Senior Developer" />
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">Company</label>
                            <input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className={inputClasses} required placeholder="Google" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">Duration</label>
                            <input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className={inputClasses} required placeholder="2020 - Present" />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                                <input type="checkbox" checked={formData.current} onChange={e => setFormData({ ...formData, current: e.target.checked })} className="w-5 h-5 rounded border-glass-border bg-dark checked:bg-primary" />
                                I currently work here
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm mb-1 block">Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClasses} rows="3" required placeholder="Describe your responsibilities..."></textarea>
                    </div>
                    <button type="submit" className="px-6 py-3 bg-primary hover:bg-indigo-600 text-white rounded-lg font-medium flex gap-2 w-fit">
                        <Plus size={20} /> Add Experience
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                {experiences.map(exp => (
                    <div key={exp.id} className="glass-card p-6 flex justify-between items-start bg-dark/30 hover:bg-dark/50 transition-colors">
                        <div>
                            <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                            <div className="text-primary font-medium mb-1">{exp.company}</div>
                            <div className="text-sm text-slate-500 mb-4">{exp.duration}</div>
                            <p className="text-slate-400 max-w-2xl">{exp.description}</p>
                        </div>
                        <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"><Trash2 size={20} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManageExperience;
