import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, User, FileText } from 'lucide-react';

const ManageProfile = () => {
    const [formData, setFormData] = useState({
        about: '',
        resumeUrl: '',
        email: '',
        phone: '',
        github: '',
        linkedin: '',
        twitter: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('/profile');
            if (data && data.about) { // Check if data exists
                setFormData(data);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/profile', formData);
            alert('Profile updated successfully!');
        } catch (err) { alert('Error updating profile'); }
        finally { setSaving(false); }
    };

    const inputClasses = "w-full bg-dark border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors";

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {/* About Section */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} /> About Me</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">Bio / About Me</label>
                            <textarea
                                value={formData.about}
                                onChange={e => setFormData({ ...formData, about: e.target.value })}
                                className={inputClasses}
                                rows="6"
                                placeholder="Tell your story..."
                            ></textarea>
                            <p className="text-xs text-slate-500 mt-2">This text will appear in the About section of your portfolio.</p>
                        </div>
                    </div>
                </div>

                {/* Resume Section */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={20} /> Resume & Socials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-slate-400 text-sm mb-1 block">Resume URL</label>
                            <input
                                value={formData.resumeUrl || ''}
                                onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                                className={inputClasses}
                                placeholder="https://example.com/my-resume.pdf"
                            />
                            <p className="text-xs text-slate-500 mt-2">Upload your resume to a cloud storage (like Google Drive, S3, or upload thing) and paste the public link here.</p>
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">Email</label>
                            <input value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClasses} />
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">Phone</label>
                            <input value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClasses} />
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">GitHub URL</label>
                            <input value={formData.github || ''} onChange={e => setFormData({ ...formData, github: e.target.value })} className={inputClasses} />
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">LinkedIn URL</label>
                            <input value={formData.linkedin || ''} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className={inputClasses} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={saving} className="px-8 py-4 bg-primary hover:bg-secondary text-white rounded-lg font-bold flex gap-2 items-center shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]">
                        <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default ManageProfile;
