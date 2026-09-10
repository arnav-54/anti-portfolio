import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            if (location.pathname === '/') {
                const sections = ['home', 'projects', 'about', 'contact'];
                const scrollPosition = window.scrollY + 180;

                for (const section of sections) {
                    const element = document.getElementById(section);
                    if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                        setActiveSection(section);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const links = [
        { name: 'Home', section: 'home' },
        { name: 'Projects', section: 'projects' },
        { name: 'About', section: 'about' },
        { name: 'Contact', section: 'contact' },
    ];

    const handleNavClick = (section) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate(`/#${section}`);
            setTimeout(() => {
                const element = document.getElementById(section);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 md:py-4 px-4 md:px-8">
            <div
                className={`max-w-7xl mx-auto rounded-2xl px-5 md:px-7 py-3 flex justify-between items-center transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/85 backdrop-blur-xl border border-orange-200/80 shadow-lg shadow-orange-500/5'
                        : 'bg-white/60 backdrop-blur-md border border-orange-200/50'
                }`}
            >
                {/* Brand Logo */}
                <Link
                    to="/"
                    onClick={() => handleNavClick('home')}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                        A
                    </div>
                    <span className="text-xl font-bold tracking-tight text-darker group-hover:text-primary transition-colors">
                        Arnav<span className="text-primary">.dev</span>
                    </span>
                </Link>

                {/* Desktop Nav Items */}
                <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-orange-100/40 px-3 py-1.5 rounded-full border border-orange-200/40">
                    {links.map((link) => {
                        const isActive = location.pathname === '/' && activeSection === link.section;
                        return (
                            <button
                                key={link.section}
                                onClick={() => handleNavClick(link.section)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-primary text-white shadow-sm shadow-primary/30 font-semibold'
                                        : 'text-dark/70 hover:text-primary hover:bg-orange-100/60'
                                }`}
                            >
                                {link.name}
                            </button>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => handleNavClick('contact')}
                        className="px-5 py-2 rounded-full bg-primary hover:bg-secondary text-white text-sm font-semibold transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] flex items-center gap-1.5"
                    >
                        Hire Me
                        <ArrowUpRight size={16} />
                    </button>
                    <Link
                        to="/admin"
                        title="Admin Portal"
                        className="p-2 text-dark/40 hover:text-primary hover:bg-orange-100/60 rounded-xl transition-all"
                    >
                        <Shield size={18} />
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <div className="flex md:hidden items-center gap-2">
                    <Link
                        to="/admin"
                        title="Admin Portal"
                        className="p-2 text-dark/60 hover:text-primary rounded-lg transition-colors"
                    >
                        <Shield size={18} />
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="p-2 text-dark hover:text-primary rounded-lg bg-orange-100/60 transition-colors"
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden mt-2 mx-auto max-w-7xl glass-card p-5 bg-white/95 backdrop-blur-2xl border border-orange-200/80 shadow-2xl flex flex-col space-y-3"
                    >
                        {links.map((link) => (
                            <button
                                key={link.section}
                                onClick={() => handleNavClick(link.section)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                                    location.pathname === '/' && activeSection === link.section
                                        ? 'bg-primary text-white font-semibold'
                                        : 'text-dark hover:bg-orange-100/60 hover:text-primary'
                                }`}
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="pt-2 border-t border-orange-100">
                            <button
                                onClick={() => handleNavClick('contact')}
                                className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-center shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                Let's Talk <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
