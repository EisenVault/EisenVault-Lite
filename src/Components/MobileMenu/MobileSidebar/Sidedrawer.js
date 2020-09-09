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
// import { instance } from '../../ApiUrl/endpointName.instatnce';

const SideDrawer=(props)=>{
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // handle click event of logout button
   const handleLogout = () => {
    
      Axios.delete(getUrl()+`/alfresco/api/-default-/public/authentication/versions/1/tickets/-me-`,
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
   
  let drawerclasses='Side-drawer';
  if(props.show){
    drawerclasses='Side-drawer open';
  }
  
  const user = getUser();
   
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
              icon={faFileAlt}/>
              <p> &nbsp;DEPARTMENTS</p>
              </li></Link>

            <Link to="/myUploads">
              <li> <FontAwesomeIcon 
              className="Icon" 
              icon={faFolderOpen}/>
              <p>MY UPLOADS</p>
              </li></Link>

              <Link to="/manageShares">
              <li> <FontAwesomeIcon 
              className="Icon" 
              icon={faShareAlt}/>
              <p>&nbsp;MANAGE SHARES</p>
              </li></Link>

              {/* <Link to="/sharedWithMe">
              <li> <FontAwesomeIcon 
              className="Icon" 
              icon={faShareSquare}/>
              <p>SHARED WITH ME</p>
              </li></Link> */}
          </div>

          <div id="lower_bar">
              <li><a target="_blank" rel="noopener noreferrer"
              href="https://support.eisenvault.com/portal/home">
              <FontAwesomeIcon 
              className="Icon" 
              icon={faHeadset}/>
              <p>SUPPORT</p>
              </a></li>

              <li><a target="_blank" rel="noopener noreferrer"
              href="https://systest.eisenvault.net/share/page/"> 
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
                <li> <FontAwesomeIcon 
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