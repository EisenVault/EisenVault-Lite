import React , { Fragment,useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Search from "../../SearchBar/SearchBar";
import ProfilePic from "../../Avtar/Avtar";
import DocumentDetails from "../../MoreDetails/MoreDetails";
import "../DocumentViewer/DocumentViewer.scss"
import { Item } from '../../backButton/backButton';
import {getToken, getUrl} from  "../../../Utils/Common";
import axios from 'axios';
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
    const [fileURI, setFileURI] = useState("");
    const [pdfFileURI, setPdfFileURI] = useState("");
    const [sidebarIsOpen, setSidebarOpen] = useState(false);
    const cors = "https://cors-anywhere.herokuapp.com/";
    let params = useParams();
    const title = params.title;
    const path = window.location.href; 
    console.log(path)
    const id =  path.slice(41,77)   
    const fileType = path.split('.').pop()
    console.log(fileType)
    
  function toggleSidebar() {
    setSidebarOpen(!sidebarIsOpen);
  }

  useEffect(() => {
    //First find out content type
    axios.get(cors+getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/content`,
        {
          headers: {
            Authorization: `Basic ${btoa(getToken())}`,
         },
        }
      ).then((response) => {
        // setDataTypes(response.headers["content-type"])
        // console.log(dataType)
        setFileURI(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/content`)
      });
  }, [id]);

  function DisplayUsingOfficeApps() {
    var token = getToken();
    var url =
      "https://view.officeapps.live.com/op/embed.aspx?src=" +
      fileURI + "?alf_ticket=" +token;
    console.log(url);
    console.log(fileURI);
    console.log(token);
    // document.getElementById('myFrame').src=url

    return (
      <Fragment>

      <iframe src={url} 
      title='mydocframe' 
      id='mydocFrame'
      width="730rem" 
      height="500rem" >
      </iframe>
      </Fragment>
    );
  }

  useEffect(() => {axios.get(cors+getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/content?attachment=false`,    
   {headers:
    {
      Authorization: `Basic ${btoa(getToken())}`
    }}).then((response)=>{
        setPdfFileURI(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/content?attachment=false`)
         })} , [id]) 

 const PdfViewer = () => {
  
        return (
          <Fragment>
          
          <div className="docFrame">

            <iframe src={pdfFileURI} 
            title='myframe' 
            id='myFrame'
            width="730rem" 
            height="500rem" 
            marginWidth="1rem"
            allowFullScreen/>
          </div>
          </Fragment>
        ); 
        
        //document.getElementById('myFrame').src=pdfPreviewUrl
    }
    
function Viewer() { 
  if (fileType === 'pdf') return PdfViewer() 
  else if (fileType === 'png') return PdfViewer()
  else return DisplayUsingOfficeApps()
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