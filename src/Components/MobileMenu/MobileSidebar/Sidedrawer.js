/******************************************
* File: Sidedrawer.js
* Desc: Display's sideDrawer when minimum width is 770px.
* @author: Vanshika Bhatt, 6 october 2020
********************************************/

import React, { useState} from 'react';
import { useHistory,Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProgressBar from "../../Navigation/NavigationItems/ProgressBar/ProgressBar";
import { faHome,
      faFileAlt, 
      faFolderOpen, 
      faShareAlt,
      faHeadset, 
      faKey, 
      faSignOutAlt, 
      faTrash } from "@fortawesome/free-solid-svg-icons";

import Axios from 'axios';
import "../MobileMenu.scss"
import "../MobileSidebar/Sidedrawer.scss"
import Auxiliary from '../../../hoc/Auxiliary';
import { getUser ,getToken,getUrl} from "../../../Utils/Common";

const SideDrawer=(props)=>{
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

   /**
   * handle click event of logout button
   */
  const handleLogout = () => {
     Axios.delete(getUrl()+`alfresco/api/-default-/public/authentication/versions/1/tickets/-me-`,
      {headers:{
        Authorization: `Basic ${btoa(getToken())}`}
      }).then(response => {
        setLoading(false);
        history.push('/');
      }).catch(error => {
          if (error.response.status === 401) setError(error.response.data.message);
          else setError("Your authentication details have not been recognized or EisenVault may not be available at this time.");        
      }, [])
   }
   
  let drawerclasses='Side-drawer';//drawer class style,which will hide side drawer from viewer.
  if(props.show){
    drawerclasses='Side-drawer open';//when .side-drawer gets another class ‘.open’, it will animate(slide in). 
  }
  
  const user = getUser(); //getting user name
   
    return(
        <Auxiliary>
            
          <nav role="navigation" >
        
           <ul className={drawerclasses} 
           onClick={props.click}>
            <div id="dashboard" > 
            <Link to="/dashboard">
              <li> <FontAwesomeIcon 
              className="Icon" 
              icon={faHome}/>
              <p >DASHBOARD</p>
              </li></Link> 
            </div>

          <div id="middle_bar">
            <Link to="/documentsList">
              <li> <FontAwesomeIcon 
              className="Icon" 
              id="departments"
              icon={faFileAlt}/>
              <p> &nbsp;DEPARTMENTS</p>
              </li></Link>

            <Link to="/myUploads">
              <li> <FontAwesomeIcon 
              className="Icon" 
              id="myUploads"
              icon={faFolderOpen}/>
              <p>MY UPLOADS</p>
              </li></Link>

              <Link to="/manageShares">
              <li> <FontAwesomeIcon 
              className="Icon" 
              id="manageShares"
              icon={faShareAlt}/>
              <p>&nbsp;MANAGE SHARES</p>
              </li></Link>
          </div>

          <div id="lower_bar">
              <li id="support"><a target="_blank" 
              rel="noopener noreferrer"
              href="https://support.eisenvault.com/portal/home">
              <FontAwesomeIcon 
              className="Icon" 
              icon={faHeadset}/>
              <p>SUPPORT</p>
              </a></li>

              <li id="fullVersion"><a target="_blank" 
              rel="noopener noreferrer"
              href= {getUrl()+"/share/page/"}> 
              <FontAwesomeIcon 
              className="Icon" 
              icon={faFileAlt}/>
              <p>&nbsp;FULL VERSION</p>
              </a>
              </li>

            </div>

            <div id="trash">
            <Link to="/trashDisplay">
                <li> <FontAwesomeIcon 
                className="Icon" 
                  icon={faTrash}/>
                  <p>TRASH</p>
                  </li></Link>

              <Link to="/changePassword">
                <li id="changePswd"> <FontAwesomeIcon 
                className="Icon" 
                icon={faKey}/>
                <p>CHANGE PASSWORD</p>
                </li></Link>

                <li>
                <FontAwesomeIcon 
                className="Icon" 
                icon={faSignOutAlt}/>
                <input type="button" className="signOut" 
                 onClick={handleLogout}
                 value="LOGOUT" />
                </li>

                {user==='admin' && <ProgressBar />}
 
            </div>
          </ul>
        </nav>
      </Auxiliary>

        );
    
}
export default SideDrawer;