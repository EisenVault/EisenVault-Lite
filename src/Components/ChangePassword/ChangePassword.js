/******************************************
* File: ChangePassword.js
* Desc: Takes a old password and new password as input and changes the password.
* @returns: Changed Password
* @author: Shrishti Raghav, 6 October 200
* @todo: 
********************************************/

import React, { Fragment , useState} from 'react';
import axios from 'axios';
import {getToken,getUser,getUrl} from  "../../Utils/Common";
import './ChangePassword.scss';
import ProfilePic from "../Avtar/Avtar";
import alertify from 'alertifyjs';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import '../../Containers/styles.scss';
import Search from '../SearchBar/SearchBar';;

function ChangePassword(props){
    // name of user loggedIn
    const user = getUser()
    const userName = user[0].toUpperCase()+user.slice(1);
    const oldPassword = useFormInput ('');
    const newPassword = useFormInput ('');
    const confirmPassword = useFormInput('');

/**
   * function for changePassword api call that changes password on success.
   *
   * @return  alert of Password Changed Successfully on success else will display an alert message of failure.
   */
function handlechangePassword(){
    
    if (newPassword.value === confirmPassword.value){
        trackPromise(
        axios.post(getUrl()+`alfresco/service/api/person/changepassword/${user}`,{
        newpw : newPassword.value, oldpw : oldPassword.value
        },
        {
            headers:
                {
                    Authorization: `Basic ${btoa(getToken())}`
                }
        }).then(response => {
            console.log(response)
            alertify.alert('Password Changed Successfully').setting({
                'message': 'Password Changed Successfully',
                'onok': () => {alertify.alert().destroy();} 
              });
        }).catch(error => {
            if (error.response.status===401){
                alert("Unauthenticated!! please enter correct password");
              }
            console.log(error)
        })
        )
    }
    else {
        alert('Password does not match');
    }
    
}

return(
    <Fragment>
        <div id="second_section">

              
            <div className="title">
            <h2>CHANGE PASSWORD</h2>
            <ProfilePic />
            </div> 

            <div className="search-profile">
            <Search />
            </div> 

                <div id="share-details-n">
                <div id="column-1">
                    <p>Enter Old Password</p>
                    <p>Enter New Password</p>
                    <p>Confirm Password</p>
                </div>
                <div id="column-2">
                    <input type="password" {...oldPassword}></input>
                    <input type="password" {...newPassword}></input>
                    <input type="password" {...confirmPassword}></input>
                </div>
                <button className="btn01" type="button" onClick={handlechangePassword}>Change</button>
                <button className="btn02" type="button">Cancel</button>
            </div>
            <LoadingIndicator/>
            </div>
                
          </Fragment>
);
}

/**
 * handles user inputs onChange and return the updated state.
 *
 * @param {text} initialValue The node Id of document.
 * @return  Return updated state of user input.
 */
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

export default ChangePassword;