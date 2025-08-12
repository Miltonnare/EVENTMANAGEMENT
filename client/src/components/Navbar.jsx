import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthed(!!token);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthed(false);
        navigate('/login');
    };

    return (
        <nav className='bg-white/90 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-200/50'>
           
            <div className='text-2xl font-bold text-gray-800'>
                <Link to='/'>EventSphere</Link>
            </div>
            <div className='space-x-6 text-sm font-medium'>
                <Link to="/" className="hover:text-gray-600 text-gray-700">Home</Link>
                <Link to="/events" className="hover:text-gray-600 text-gray-700">Events</Link>
                {isAuthed ? (
                    <>
                      <Link to="/dashboard" className="hover:text-gray-600 text-gray-700">Dashboard</Link>
                      <button onClick={logout} className="hover:text-gray-600 text-gray-700">Logout</button>
                    </>
                ) : (
                    <>
                      <Link to="/register" className="hover:text-gray-600 text-gray-700">Register</Link>
                      <Link to="/login" className="hover:text-gray-600 text-gray-700">Login</Link>
                    </>
                )}
            </div>
            
        </nav>
    );
}

export default Navbar;