import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className='bg-white shadow-md px-6 py-4 flex justify-between items-center'>
           
            <div className='text-2xl font-bold text-blue-600'>
                <Link to='/'>EventSphere</Link>
            </div>
            <div className='space-x-6 text-sm font-medium'>
                <Link to="/" className="hover:text-blue-600">Home</Link>
                <Link to="/events" className="hover:text-blue-600">Events</Link>

                <Link to="/register" className="hover:text-blue-600">Register</Link>
                <Link to="/login" className="hover:text-blue-600">Login</Link>
            </div>
            
        </nav>
    );
}

export default Navbar;