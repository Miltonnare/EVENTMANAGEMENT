
import {Link} from 'react-router-dom';

const Navbar=()=>{


    return(
        <nav className='bg-white shadow-md px-6 py-4 flex justify-between items-center'>
            <div className='text-2xl font-bold text-blue-600'>
                <Link to='/'>EventSphere</Link>

            </div>
            <div className='space-x-6 text-sm font-medium'>
                <a href='/' className='hover:text-blue-600'> Home</a>
                <a href='#events' className='hover:text-blue-600'> Events</a>
                <a href='/register' className='hover:text-blue-600'> Register</a>
                <a href='/login' className='hover:text-blue-600'> Login</a>

            </div>

        </nav>
    )


}

export default Navbar;