import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-light relative overflow-hidden">
            <Navbar />
            <main className="flex-grow w-full z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
export default Layout;
