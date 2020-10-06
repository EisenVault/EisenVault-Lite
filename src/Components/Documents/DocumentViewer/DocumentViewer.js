import React , { Fragment,useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Search from "../../SearchBar/SearchBar";
import ProfilePic from "../../Avtar/Avtar";
import DocumentDetails from "../../MoreDetails/MoreDetails";
import "../DocumentViewer/DocumentViewer.scss"
import { Item } from '../../backButton/backButton';
import {getToken, getUrl} from  "../../../Utils/Common";
import { Animated } from "react-animated-css";

/******************************************
* File: DocumentViewer.js
* Desc: To preview the files.
* @returns: Preview of files.
* @author: Shayane Basu, 06 October 2020
********************************************/


/****
 * Function for more details button. 
 * @param: (1) Label for the button.
 * @param: (2) On Click event handler to handle the button click.
 * @return The more details button.
 ****/
function ToggleButton({ label, onClick })
 {
   return (
    <button className="toggle" onClick={onClick}>
      {label} 
    </button>
  );
}

/****
 * Function for the visibility of document details when more details button is clicked. 
 * @param: (1) {visible} Visibility of the box with document details.
 * @param: (2) {children} Child of AnimatedVisibility Function.
 * @return Animation on more details box.
 ****/
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
      style={style}>
      {children}
    </Animated>
  );
}

/****
 * Function for the open the document details when more details button is clicked. 
 * @param: Visibility of the box with document details.
 * @return More details box with API call in DocumentDetails function.
 ****/
function Sidebar({ open }) {
  return (
    <AnimatedVisibility
      visible={open}
      className="on-top">

      <div className="sidebar">
        <ul>
          <li>{DocumentDetails()}</li>
        </ul>
      </div>
    </AnimatedVisibility>
  );
}

/****
 * Function to open the file previews. 
 * @param: Title of the document which is previewed.
 * @return File preview as per the file type.
 ****/
function DocPreview() {
    const [sidebarIsOpen, setSidebarOpen] = useState(false);

    let params = useParams();
    const title = params.title;
    const path = window.location.href; 
     
    let nodeId =  path.split('/')
    let id = nodeId[5]

    var token = getToken();

    const fileType = path.split('.').pop()
    
  //To open the more details box.
  function toggleSidebar() {
    setSidebarOpen(!sidebarIsOpen);
  }

//Accepted file types.
const acceptedFileTypes = ["pdf", "jpeg", "PNG", "png"]

//Accepted Ms-Office file types.
const acceptedMsOfficeTypes = ["ppt", "pptx", "doc", "docx", "xlsx", "xls", "odt"]

/****
 * Function to check the file type and open the file previews accordingly. 
 * @return File preview as per the file type.
 ****/
function Viewer() { 
  if (acceptedFileTypes.includes(fileType)) return PdfViewer() 
  else if (acceptedMsOfficeTypes.includes(fileType)) 
  return DisplayUsingOfficeApps()
  else return error()
}

/****
 * Function to display error message in case of non-supported file types. 
 * @return Error message inside iframe.
 ****/
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

  /****
 * Function to open the file previews of Ms-office files with API call. 
 * @return File preview of Ms-Office files.
 ****/
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

  /****
 * Function to open the file previews of pdf and jpg with API call. 
 * @return File preview of pdf and jpg files.
 ****/
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