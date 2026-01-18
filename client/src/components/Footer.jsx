import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-8 mt-20 border-t border-glass-border">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center space-x-6 mb-4 text-slate-400">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Github size={20} /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
                    <a href="mailto:email@example.com" className="hover:text-primary transition-colors"><Mail size={20} /></a>
                </div>
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Portfolio. All rights reserved. Built with React & Tailwind.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
