import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X } from 'lucide-react';

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({ name: '', category: 'Frontend', level: 50 });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const { data } = await axios.get('/skills');
            setSkills(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/skills', formData);
            setFormData({ name: '', category: 'Frontend', level: 50 });
            fetchSkills();
        } catch (err) { alert('Error adding skill'); }
    };

    const handleDelete = async (id) => {
        // if (confirm('Delete skill?')) { // Removing confirm for now as it might be blocked
        try {
            await axios.delete(`/skills/${id}`);
            fetchSkills();
        } catch (err) { console.error(err); }
        // }
    };

    const inputClasses = "w-full bg-dark border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors";

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Skills</h1>

            <div className="glass-card p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <label className="text-slate-400 text-sm mb-1 block">Skill Name</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClasses} required placeholder="e.g. React" />
                    </div>
                    <div className="w-full md:w-64">
                        <label className="text-slate-400 text-sm mb-1 block">Category</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClasses}>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="Tools">Tools</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="w-full md:w-32">
                        <label className="text-slate-400 text-sm mb-1 block">Level</label>
                        <input type="number" min="0" max="100" value={formData.level} onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) })} className={inputClasses} />
                    </div>
                    <button type="submit" className="px-6 py-3 bg-primary hover:bg-indigo-600 text-white rounded-lg font-medium whitespace-nowrap flex gap-2">
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => (
                    <div key={skill.id} className="glass-card p-4 flex justify-between items-center bg-dark/30">
                        <div>
                            <h3 className="font-bold text-white">{skill.name}</h3>
                            <div className="text-xs text-slate-500">{skill.category} • {skill.level}%</div>
                        </div>
                        <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManageSkills;
