import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col bg-light relative overflow-hidden text-dark">
            <Navbar />
            <main className={`flex-grow w-full z-10 ${isHome ? '' : 'pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'}`}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
