import { useState, useEffect } from 'react';
import axios from 'axios';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/profile');
                if (data) setProfile(data);
            } catch (err) {
                // Silent catch on footer
            }
        };
        fetchProfile();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socials = [
        { icon: Github, href: profile.github || 'https://github.com/arnavaru62', label: 'GitHub' },
        { icon: Linkedin, href: profile.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Twitter, href: profile.twitter || 'https://twitter.com', label: 'Twitter' },
        { icon: Mail, href: profile.email ? `mailto:${profile.email}` : 'mailto:arnavaru62@gmail.com', label: 'Email' },
    ];

    return (
        <footer className="mt-20 border-t border-orange-200/60 bg-gradient-to-b from-transparent to-orange-100/40 py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                                A
                            </div>
                            <span className="text-lg font-bold tracking-tight text-darker">
                                Arnav Kumar
                            </span>
                        </div>
                        <p className="text-sm text-secondary font-light max-w-sm">
                            Crafting high-performance digital experiences, scalable backends, and modern interfaces.
                        </p>
                    </div>

                    {/* Socials & Back to Top */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-3">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-white border border-orange-200/80 flex items-center justify-center text-secondary hover:text-white hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm hover:scale-110"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>

                        <button
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            className="w-10 h-10 rounded-full bg-orange-100/80 hover:bg-primary hover:text-white text-secondary transition-all flex items-center justify-center shadow-sm"
                            title="Back to top"
                        >
                            <ArrowUp size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-orange-200/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-secondary/80">
                    <p>© {new Date().getFullYear()} Arnav Kumar. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Designed & Built with <span className="text-primary font-bold">React</span>, <span className="text-primary font-bold">Tailwind</span> & <span className="text-primary font-bold">Node.js</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
