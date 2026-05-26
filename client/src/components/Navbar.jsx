import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated, clearAuth } from '../utils/auth';
import { logoutUser } from '../utils/api';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthed, setIsAuthed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsAuthed(isAuthenticated());
    }, []);

    const logout = async () => {
        await logoutUser();
        setIsAuthed(false);
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className='bg-white/90 backdrop-blur-md shadow-lg border-b border-violet-100/50 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex justify-between items-center'>
                    {/* Logo */}
                    <div className='text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                        <Link to='/' className='hover:opacity-80 transition-opacity duration-200'>
                            EventSphere
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex space-x-6 lg:space-x-8 text-sm lg:text-base font-medium'>
                        <Link 
                            to="/" 
                            className="text-gray-700 hover:text-violet-600 transition-colors duration-200 hover:scale-105 transform"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/events" 
                            className="text-gray-700 hover:text-violet-600 transition-colors duration-200 hover:scale-105 transform"
                        >
                            Events
                        </Link>
                        {isAuthed ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className="text-gray-700 hover:text-violet-600 transition-colors duration-200 hover:scale-105 transform"
                                >
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={logout} 
                                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/register" 
                                    className="text-gray-700 hover:text-violet-600 transition-colors duration-200 hover:scale-105 transform"
                                >
                                    Register
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className='md:hidden p-2 rounded-lg text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2'
                        aria-label="Toggle mobile menu"
                    >
                        <svg 
                            className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen 
                        ? 'max-h-96 opacity-100 mt-4' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                    <div className='bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-violet-100/50 p-4 space-y-3'>
                        <Link 
                            to="/" 
                            onClick={closeMobileMenu}
                            className="block text-gray-700 hover:text-violet-600 hover:bg-violet-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/events" 
                            onClick={closeMobileMenu}
                            className="block text-gray-700 hover:text-violet-600 hover:bg-violet-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                        >
                            Events
                        </Link>
                        {isAuthed ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    onClick={closeMobileMenu}
                                    className="block text-gray-700 hover:text-violet-600 hover:bg-violet-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                                >
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={logout} 
                                    className="w-full text-left bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/register" 
                                    onClick={closeMobileMenu}
                                    className="block text-gray-700 hover:text-violet-600 hover:bg-violet-50 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                                >
                                    Register
                                </Link>
                                <Link 
                                    to="/login" 
                                    onClick={closeMobileMenu}
                                    className="block w-full text-center bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;