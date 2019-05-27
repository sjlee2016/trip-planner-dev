import axios from 'axios'; 
import {setAlert} from './alert';  
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types'; 

// Register User
export const register = ({ name, email, password }) => async dispatch => {
    console.log("trying to register.. ");
    const config = {
        headers : {
            'Access-Control-Allow-Origin': '*',
            'Content-Type' : 'application/json'
        }
    }
    const body = JSON.stringify({name,email,password}); 
    try{
        const res = await axios.post('/api/users', body, config);
        console.log(res);
        dispatch({ 
            type : REGISTER_SUCCESS,
            payload : res.data 
        }); 
        console.log("success");
    }catch(err){
        var errors = null; 
        if(err.response){
            switch(err.response.status){
            case 404: dispatch(setAlert("Server Error", 'danger')); break;
            default : dispatch(setAlert("Internal Error", 'danger'));
        } 
    }
        dispatch({
            type: REGISTER_FAIL
        })
    }
};