import React, {Fragment, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {login, loadUser} from '../../actions/auth'; 
import {connect} from 'react-redux'; 
import PropTypes from 'prop-types'; 

const Login = ({setAlert, login, isAuthenticated, loadUser }) => {
  const [ formData, setFormData ] = useState({
    email : '',
    password : ''
  }); 
  const { email, password }  = formData;

  const onChange = async (e) => {
    setFormData({...formData, [e.target.name] : e.target.value}); 
  }
  
  // redirect if authenticated
  if(isAuthenticated){
    return <Redirect to="/" />
  }
  const onSubmit = async e => {
    console.log("submitted");
    e.preventDefault();
    if(email==null ||  password == null ){
      setAlert('Email or password is missing', 'danger'); 
    }else{
      login({email,password}); 
      loadUser(); 
    }
  }
    return (
        <Fragment>
        <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={ e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={e => {onChange(e)}}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            onChange={e => {onChange(e)}}
            name="password"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login"  />
      </form>
      <p className="my-1">
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </section>
    </Fragment>
    );
};

Login.propTypes = {
  setAlert : PropTypes.func.isRequired,
  login : PropTypes.func.isRequired,
  isAuthenticated : PropTypes.bool.isRequired,
  loadUser : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated : state.auth.isAuthenticated
}); 
export default connect(mapStateToProps, {setAlert, login, loadUser}) (Login);