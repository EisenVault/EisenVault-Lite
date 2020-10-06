/******************************************
* File: IconBar.js
* Desc: This a iconBar for Documents Page.
* @returns: IconBar
* @author: Shrishti Raghav, 6 October 2020
* @todo: 
********************************************/

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } 
  from "@fortawesome/free-solid-svg-icons";
import "./IconBar.scss";
import {getUser} from  "../../Utils/Common";

const IconBar = (props) => {
  // name of user loggedIn
  const user = getUser();
  return(
  <div className="icons">
    <h3 className="departments">My Departments</h3>
    
    <div >
    { user === 'admin' &&
      <FontAwesomeIcon icon={faPlus} onClick={props.toggleadd} className="icon-item"/>}
    </div>
    
  </div>
)}

export default IconBar;