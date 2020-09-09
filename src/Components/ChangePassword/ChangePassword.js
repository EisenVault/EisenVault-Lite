import React, { Fragment , useState} from 'react';
import axios from 'axios';
import {getToken,getUser,getUrl} from  "../../Utils/Common";
import './ChangePassword.scss';
import ProfilePic from "../Avtar/Avtar";

import '../../Containers/styles.scss';
import Search from '../SearchBar/SearchBar';;

function ChangePassword(props){
    const user = getUser()
    const userName = user[0].toUpperCase()+user.slice(1);
    const oldPassword = useFormInput ('');
    const newPassword = useFormInput ('');
    const confirmPassword = useFormInput('');

function handlechangePassword(){
    if (newPassword.value === confirmPassword.value){
        axios.post(getUrl()+`/alfresco/service/api/person/changepassword/${userName}`,{
        newpw : newPassword.value, oldpw : oldPassword.value
        },
        {
            headers:
                {
                    Authorization: `Basic ${btoa(getToken())}`
                }
        }).then(response => {
            alert("Password Successfully changed");
            console.log(response)
        }).catch(error => {
            if (error.response.status===401){
                alert("Unauthenticated!! please enter correct password");
              }
            console.log(error)
        });
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

export default ChangePassword;