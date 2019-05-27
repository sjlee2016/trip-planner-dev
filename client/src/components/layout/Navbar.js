import React from 'react';
import {Link} from 'react-router-dom'; 

const Navbar = (props) => {
    return (
        <nav className="navbar bg-dark">
        <h1>
         <Link to='/' ><i className="fas fa-code"></i> Se Jin Website</Link>
        </h1>
        <ul>
          <li><Link to='/profile'>Developers</Link></li>
          <li><Link to='/register'>Register</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>
        </nav>
    )
};
export default Navbar