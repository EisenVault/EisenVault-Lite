import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import { ForgotPassword } from '../Modal/DeleteModalSumm/DeleteSumm';
import { setUserLocal } from '../../Utils/Common';
import './LoginPage.scss';

const LoginPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [err, setPswdError] = useState(null);

  const userName = useFormInput ('');
  const password = useFormInput ('');
  const forgotPswdUserName = useFormInput ('');

  const handleLogin = () => {
    setError(null);
    setLoading(true);
 //{ userId: 'admin', password: 'Systest@987'}
    axios.post('https://systest.eisenvault.net/alfresco/api/-default-/public/authentication/versions/1/tickets', 
    { userId: userName.value, password: password.value}).then(response => {
      setLoading(false);
      setUserLocal(response.data.entry.id, response.data.entry.userId);
      props.history.push('/dashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else 
      setError("Your authentication details have not been recognized or EisenVault may not be available at this time.");
    });
  }

const handleForgotPassword = () => {
  setPswdError(null);

  axios.post('https://systest.eisenvault.net/share/proxy/alfresco-noauth/com/flex-solution/reset-password',
  { userName: forgotPswdUserName.value }).then(response => {
    alert('Email Sent Successfully')
    console.log("Email Sent");
    console.log(response);
  }).catch(err => {
    if (err.response.status === 401) 
    setPswdError(err.response.data.message);
      else 
      setPswdError("The user name doesn't exist.");
  });
}

    return(

      <Fragment>

        <div id="bg-bar">

        <div className="login-box">
            <div className="login-details">
                <input type="text" {...userName} 
                id="user-name" placeholder="User Name" required/>
                  <br />
                <input type="password" {...password}
                placeholder="Password" id="pswd" required/>
            </div>

            <div id="btns_new">
                
                {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
                <br />
                <button id="btn_login" type="button" 
                value={loading ? 'Loading...' : 'Login'} 
                onClick={handleLogin} disabled={loading}>
                Login</button>
                <br />

                <Modal show={modalIsOpen}>
                
                  <ForgotPassword                   
                  resetPassword={handleForgotPassword}
                  clicked={() => setmodalIsOpen(false)}
                  forgotPswdUserName={forgotPswdUserName}/>

                  {err && <><small style={{ color: 'red' }}>
                  {err}</small><br /></>}
                </Modal>     

                <button id="btn_forgotPassword" type="button" 
                  onClick={() => setmodalIsOpen(true)}>
                    Forgot Password?</button>
                    
            </div> 
        </div>  
        </div>
    </Fragment>
);
  
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange
  }
}

export default LoginPage;