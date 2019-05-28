import React from 'react'
import {Link} from 'react-router-dom'; 
import {connect} from 'react-redux'; 
import PropTypes from 'prop-types';

const Landing = ({isAuthenticated, user}) => {
    
    if(isAuthenticated) {
      return(
        <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Se Jin's Blog</h1>
          <p className="lead">
            Welcome Back 
          </p>
        </div>
      </div>
    </section>
    ) 
    } 
    return(
        <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Se Jin's Blog</h1>
          <p className="lead">
            Welcome to Se Jin's Blog 
          </p>
          <div className="buttons">
            <Link to='/register' className="btn btn-primary">Sign Up </Link> 
            <Link to='/login' className="btn btn-light">Login </Link> 
          </div>
        </div>
      </div>
    </section>
    )
};

Landing.propTypes = {
  isAuthenticated : PropTypes.bool,
  user : PropTypes.object
}; 
const mapStateToProps = state => ({
  isAuthenticated : state.auth.isAuthenticated, 
  user : state.auth.user 
});
export default connect(mapStateToProps)(Landing)