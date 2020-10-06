import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } 
  from "@fortawesome/free-solid-svg-icons";
import "./IconBar.scss";
import {getUser} from  "../../Utils/Common";

const IconBar = (props) => {
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