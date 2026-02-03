import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-indigo-600">VolunteerHub</Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Home</Link>
                        <Link to="/activities" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Activities</Link>
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Admin</Link>
                        )}
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">My Activities</Link>
                                <button onClick={handleLogout} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Login</Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700">Register</Link>
                            </>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/activities" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Activities</Link>
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                        )}
                        {user ? (
                            <>
                                <Link to="/dashboard" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                <button onClick={handleLogout} className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
