import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('home');

    // Simple scroll spy effect (optional, or just default to location.hash)
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'projects', 'about', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Home', path: '#home' },
        { name: 'Projects', path: '#projects' },
        { name: 'About', path: '#about' },
        { name: 'Contact', path: '#contact' },
    ];

    // Helper to check if link is active
    // const isActive = (path) => location.pathname === path; // Deprecated for hash


    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8">
            <div className="max-w-7xl mx-auto glass-card px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold font-sans tracking-tighter text-darker">
                    Portfolio.
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8">
                    {links.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === link.path.substring(1) ? 'text-primary' : 'text-dark/60'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden text-dark cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-20 left-4 right-4 glass-card p-4 flex flex-col space-y-4 shadow-xl"
                >
                    {links.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className="text-base font-medium text-center text-dark hover:text-primary"
                        >
                            {link.name}
                        </a>
                    ))}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
