import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import { ForgotPassword } from '../Modal/DeleteModalSumm/DeleteSumm';
import { setUserLocal, getUrl, setUrl } from '../../Utils/Common';
import './LoginPage.scss';
// import { instance } from '../ApiUrl/endpointName.instatnce';
import { instance } from '../ApiUrl/endpointName.instatnce';

const LoginPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [pswdloading, setPswdLoading] = useState(false);

  const [error, setError] = useState(null);
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  const [err, setPswdError] = useState(null);

  // setUrl(url.value)
  // const userUrl = getUrl()
  // console.log(userUrl)

  const userName = useFormInput ('');
  const password = useFormInput ('');
  const forgotPswdUserName = useFormInput ('');

  const url = useFormInput('');

  const handleLogin = () => {
    setUrl(url.value)
  const userUrl = url.value
  console.log(userUrl)
  
    setError(null);
    setLoading(true);
    // Axios.post(getUrl()+'/alfresco/api/-default-/public/authentication/versions/1/tickets', 

    axios.post(userUrl+'/alfresco/api/-default-/public/authentication/versions/1/tickets', 
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

  const closeModal=()=>{ 
    //function to close modal after performing it's operations
  return (setmodalIsOpen(false)
  // setPasswordHandler(false)
  )
}

function HandleForgotPassword() {
  setPswdError(null);
  setPswdLoading(true);

  axios.post(getUrl()+'/share/proxy/alfresco-noauth/com/flex-solution/reset-password',
  { userName: forgotPswdUserName.value }).then(response => {
    setPswdLoading(false);
    closeModal();
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

    return(

      <Fragment>

        <div id="bg-bar">

        <div className="login-box">
            <div className="login-details">
              <input type="text" {...url} 
                id="url" placeholder="URL" required/>
                <br/>
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
                  resetPassword={HandleForgotPassword}
                  clicked={() => setmodalIsOpen(false)}
                  forgotPswdUserName={forgotPswdUserName}/>

                  {err && <><small style={{ color: 'red' }}>
                  {err}</small><br /></>}
                </Modal>     

                <button id="btn_forgotPassword" type="button" 
                  onClick={() => {return(setmodalIsOpen(true)
                    )}}>
                    Forgot Password?</button>
                    
            </div> 
        </div>  
        </div>
    </Fragment>
);
  
}

const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey) || ''
  );
 
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);
 
  return [value, setValue];
};

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