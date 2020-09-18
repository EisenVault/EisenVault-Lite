import React , { Fragment,useState,useEffect, version } from 'react';
import { useParams } from 'react-router-dom';
import Search from "../../SearchBar/SearchBar";
import ProfilePic from "../../Avtar/Avtar";
import DocumentDetails from "../../MoreDetails/MoreDetails";
import "../DocumentViewer/DocumentViewer.scss"
import { Item } from '../../backButton/backButton';
import {getToken, getUrl} from  "../../../Utils/Common";

import { Animated } from "react-animated-css";

// import { instance } from '../../ApiUrl/endpointName.instatnce';

function ToggleButton({ label, onClick }) {
  
  return (
    <button className="toggle" onClick={onClick}>
      {label} 
    </button>
  );
}

function AnimatedVisibility({ visible, children }) {
  const [noDisplay, setNoDisplay] = useState(!visible);
  useEffect(() => {
    if (!visible) setTimeout(() => setNoDisplay(true), 650);
    else setNoDisplay(false);
  }, [visible]);

  const style = noDisplay ? { display: "none" } : null;
  return (
    <Animated
      isVisible={visible}
      style={style}
    >
      {children}
    </Animated>
  );
}

function Sidebar({ open }) {
  return (
    <AnimatedVisibility
      visible={open}
      className="on-top"
    >
      <div className="sidebar">
        <ul>
          <li>{DocumentDetails()}</li>
        </ul>
      </div>
    </AnimatedVisibility>
  );
}

function DocPreview() {
    const [sidebarIsOpen, setSidebarOpen] = useState(false);

    let params = useParams();
    const title = params.title;
    const path = window.location.href; 
     
    let nodeId =  path.split('/')
    let id = nodeId[5]

    var token = getToken();

    const fileType = path.split('.').pop()
    
  function toggleSidebar() {
    setSidebarOpen(!sidebarIsOpen);
  }

const acceptedFileTypes = ["pdf", "jpeg", "PNG", "png"]
const acceptedMsOfficeTypes = ["ppt", "pptx", "doc", "docx", "xlsx", "xls", "odt"]

function Viewer() { 
  if (acceptedFileTypes.includes(fileType)) return PdfViewer() 
  else if (acceptedMsOfficeTypes.includes(fileType)) 
  return DisplayUsingOfficeApps()
  else return error()
}

function error(){

  console.log("Error Occured")
    return (
    <Fragment>
    <iframe 
    id="errorFrame"
    title="error"
    src={"data:text/html,"
    +encodeURIComponent("This document can't be previewed. Please visit the full version.")}
    width="730rem" 
    height="500rem">
      </iframe>
      </Fragment>
    )
  }

  function DisplayUsingOfficeApps() {
    return (
      <Fragment>
      <div className="docFrame">
      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=`+
      getUrl()+
      `alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/content?alf_ticket=${token}`} 
      title='mydocframe' 
      onLoad={() => 'null'}
      id='mydocFrame'
      width="730rem" 
      height="500rem" >
      </iframe>
      </div>
      </Fragment>
    );
  }

 const PdfViewer = () => {

        return (
          <Fragment>
          
          <div className="docFrame">

            <iframe src={getUrl()+
            `/alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/content?attachment=false&alf_ticket=${token}#toolbar=0`}
            onLoad={() => 'null'}
            title='myframe' 
            id='myFrame'
            width="730rem" 
            height="500rem" 
            marginWidth="1rem"
            allowFullScreen>
          </iframe>
          </div>
          </Fragment>
        );         
    }

return(
    <Fragment>
     <div id="second_section">
      <div className="title">
        <h2>{title}</h2>
        <ProfilePic />

      </div>
      <div className="search-profile">
        <Search />
      </div>
      
      <div className="buttons">
        <div className="back-button">
        <Item/>
        </div>

        <div className="details">
        <ToggleButton
            label="More Details"
            isOpen={sidebarIsOpen}
            onClick={toggleSidebar}
            />
        <Sidebar open={sidebarIsOpen}/>
        </div>
      </div>

        <Viewer />                  
        
    </div>
    </Fragment>
)
}

export default DocPreview;