import React, { Fragment, useState } from 'react';
import axios from 'axios';
import alertify from 'alertifyjs';

import Modal from '../Modal/Modal';
import { ForgotPassword } from '../Modal/modalSummary/ModalSummary';
import { setUserLocal, getUrl, setUrl } from '../../Utils/Common';
import './LoginPage.scss';

/******************************************
* File: Login.js
* Desc: Function to handle the user login and take url input from user.
* @returns: Handle user login.
* @author: Shayane Basu, 06 October 2020
********************************************/
const LoginPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [pswdloading, setPswdLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  const [err, setPswdError] = useState(null);

  const userName = useFormInput ('');
  const password = useFormInput ('');
  const forgotPswdUserName = useFormInput ('');

  //Take url input from user
  let url = useFormInput('');
  let newUrl
  //Different checks to ensure that user enters correct url.
  url.value.startsWith("https://") ?   
  newUrl = url.value.replace(/\/?(\?|#|$)/, '/$1'):
  newUrl = "https://" + url.value.replace(/\/?(\?|#|$)/, '/$1')

  //Function to handle login with API call.
  const handleLogin = () => {
    setUrl(newUrl)

    setError(null);
    setLoading(true);

    axios.post(getUrl()+'alfresco/api/-default-/public/authentication/versions/1/tickets', 
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

  const closeModal=()=>{ //function to close modal after performing it's operations
  return (setmodalIsOpen(false)
   )
}

//Function to handle forgot password with API call.
function HandleForgotPassword() {
  setPswdError(null);
  setUrl(newUrl)
  setPswdLoading(true);

  axios.post(getUrl()+'share/proxy/alfresco-noauth/com/flex-solution/reset-password',
  { userName: forgotPswdUserName.value }).then(response => {
    setPswdLoading(false);
    closeModal();
    
    alertify.alert('Please Check your registered email id.').setting({
      'message': 'Please Check your registered email id.',
      'onok': () => {alertify.alert().destroy();} 
    });
    console.log("Email Sent");
    console.log(response);
  }).catch(err => {
    if (err.response.status === 401) 
    setPswdError(err.response.data.message);
      else 
      setPswdError("The user name doesn't exist.");
  });
}

if (loading) {
  return <div><i className="fa fa-spinner fa-spin" /> Loading...</div>
}

//Function to login when you click on enter key.
const onEnter = (event) => {
  if (event.key === "Enter")
  handleLogin()
}


    return(

      <Fragment>

        <div id="bg-bar">

        <div className="login-box">
            <div className="login-details">
              <input type="text" {...url} 
                name="url" id="url" className="url"
                placeholder="URL" required
                />
                <br/>
                <input type="text" {...userName} 
                name="username" id="user-name" 
                placeholder="User Name" required/>
                  <br />
                <input type="password" {...password} 
                name="password"
                onKeyPress={onEnter}
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
                  pswdloading={pswdloading}              
                  resetPassword={HandleForgotPassword}
                  clicked={() => setmodalIsOpen(false)}
                  forgotPswdUserName={forgotPswdUserName}
                  url={url}/>

                  {err && <><small style={{ color: 'red' }}>
                  {err}</small><br /></>}
                </Modal>     

               <button id="btn_forgotPassword" type="button" 
                  onClick={() => {return(setmodalIsOpen(true))}}>
                    Forgot Password?</button>
                    
            </div> 
        </div>  
        </div>
    </Fragment>
);
  
}

// const useStateWithLocalStorage = localStorageKey => {
//   const [value, setValue] = React.useState(
//     localStorage.getItem(localStorageKey) || ''
//   );
 
//   React.useEffect(() => {
//     localStorage.setItem(localStorageKey, value);
//   }, [value]);
 
//   return [value, setValue];
// };

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