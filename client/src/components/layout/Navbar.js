import React from 'react';
import {Link} from 'react-router-dom'; 
import {logOut} from '../../actions/auth'; 
import {Button} from 'react-bootstrap'; 
import {connect } from 'react-redux'; 
import PropTypes from 'prop-types'; 

const Navbar = ({isAuthenticated}) => {

    /*
    function handleClick(e){
        console.log("handleClick");
    }
    */ 

    const onClick = (e)=> {
        console.log("trigged");
         logOut();
    }

    if(isAuthenticated){

        return (
            <nav className="navbar bg-dark">
            <h1>
            <Link to='/' ><i className="fas fa-code"></i> Se Jin Website</Link>
            </h1>
            <ul> 
            <li><Link to='/profile'>Developers</Link></li>
            <li onClick={onClick}>Log out</li>
            </ul>
            </nav>
        )
    }
    return (
        <nav className="navbar bg-dark">
        <h1>
         <Link to='/' ><i className="fas fa-code"></i> Se Jin Website</Link>
        </h1>
        <ul>
          <li><Link to='/profile'>Developers</Link></li>
          <li><Link to='/register'>Registelr</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>
        </nav>
    )
};

Navbar.propTypes = {
    isAuthenticated : PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated : state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Navbar);