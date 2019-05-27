import React, {Fragment, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {login} from '../../actions/auth'; 
import {connect} from 'react-redux'; 
import PropTypes from 'prop-types'; 

const Login = ({setAlert, login, isAuthenticated }) => {
  const [ formData, setFormData ] = useState({
    email : '',
    password : ''
  }); 
  const { email, password }  = formData;

  const onChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value}); 
  }
  
  // redirect if authenticated
  if(isAuthenticated){
    return <Redirect to="/" />
  }
  const onSubmit = (e) => {
    e.preventDefault();
    if(email==null ||  password == null ){
      setAlert('Email or password is missing', 'danger'); 
    }else{
      login({email,password}); 
    }
  }
    return (
        <Fragment>
        <section class="container">
      <div class="alert alert-danger">
        Invalid credentials
      </div>
      <h1 class="large text-primary">Sign In</h1>
      <p class="lead"><i class="fas fa-user"></i> Sign into Your Account</p>
      <form class="form" onSubmit={ e => onSubmit(e)}>
        <div class="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={e => {onChange(e)}}
            required
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            onChange={e => {onChange(e)}}
            name="password"
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Login"  />
      </form>
      <p class="my-1">
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </section>
    </Fragment>
    );
};

Login.propTypes = {
  setAlert : PropTypes.func.isRequired,
  login : PropTypes.func.isRequired,
  isAuthenticated : PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated : state.auth.isAuthenticated
}); 
export default connect(mapStateToProps, {setAlert, login}) (Login);