import React , { Fragment,useEffect, useState } from 'react';
import "./MoreDetails.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faShareAlt} from "@fortawesome/free-solid-svg-icons"
// import {instance} from "../ApiUrl/endpointName.instatnce"
import { useHistory,useParams } from "react-router-dom";
import {getToken, getUrl} from "../../Utils/Common";
import Axios from 'axios';


const DocumentDetails = (props) => {

    const [createdBy, setCreatedBy] = useState([]);
    const [createdAt, setCreatedAt] = useState([]);

    const [docSize, setDocSize] = useState([]);
    const [modificationDate, setmodificationDate] = useState([]);
    const [documentType, setDocumentType] = useState([]);
    const [latestVersion, setLatestVersion] = useState([]);

    const [auditDetails, setAuditDetails] = useState([])

    let history = useHistory();
    let params = useParams();

    const title = params.title;

    const path = window.location.href; 
    let nodeId =  path.split('/')
    let id = nodeId[5]
    
    /****
     * Function to convert bytes to other size like GB, KB, MB, TB. 
     * @param: (1) {bytes} Size in bytes.
     * @param: (2) Seperator.
     * @return Converted file size which is more readable.
     ****/
    function bytesToSize(bytes, seperator = "") {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        {/* Convert string to integer and then convert bytes to KB/MB/GB/TB */}
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes}${seperator}${sizes[i]}`
        return `${(bytes / (1024 ** i)).toFixed(1)}${seperator}${sizes[i]}`
      }

    useEffect(()=>{
        DocDetails();
    },[id])

    /******************************************
    * Desc: Function to get the document details.
    * @returns: The document details like modification date, document type, 
    * created by, created at and document size.
    ********************************************/
    function DocDetails(){
        Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}`,
        {
            headers: {
              Authorization: `Basic ${btoa(getToken())}`,
           }
          }).then((response) => {
            setmodificationDate(response.data.entry.modifiedAt.split('T')[0])
            setDocumentType(response.data.entry.nodeType.split(':')[1])
            setDocSize(response.data.entry.content)
            setCreatedBy(response.data.entry.createdByUser.displayName)
            setCreatedAt(response.data.entry.createdAt.split('T')[0])
    })}

      /******************************************
    * Desc: Function to share a document with API call.
    * @returns: The shared link (shown as a alert message).
    ********************************************/
    function DocumentShare () {
        Axios.post(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/shared-links`,
        {"nodeId":`${id}`},
        {
            headers: {
              Authorization: `Basic ${btoa(getToken())}`,
           },
          }).then((response) => {
              const sharedLink = response.data.entry.id
              alert("Your public share link is https://systest.eisenvault.net/share/s/" +sharedLink)
          }) 
    }

    useEffect(()=>{AuditTrail()}, [id])

    /******************************************
    * Desc: Function to get the latest 5 audit trail(activities on a file) with API call.
    * @returns: Audit Trail Details.
    ********************************************/
    function AuditTrail(){
        Axios.get(getUrl()+`alfresco/s/ev/nodeaudittrail?nodeRef=workspace://SpacesStore/${id}`,
        {
            headers: {
              Authorization: `Basic ${btoa(getToken())}`,
           },
          }).then((response)=>{
              let MoreData=response.data;

        setAuditDetails(MoreData.data.slice(0,5).map(d=>{
                    return{
                    time: d.time.split('T')[0],
                    action: d.method,
                    user: d.userName.split('.')[0],
                    }
                }))
          })}

    //Function to create an url which will consist of id and title (document name)
    const handleOnClick = () => {
        history.push(`/actions/${id}/${title}/AuditTrails`);
    }

    useEffect(()=>{
        versions();},
        [id])

    //Function to display all the versions of a document.  
    function versions() {
    Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/versions`,
    {
        headers: {
          Authorization: `Basic ${btoa(getToken())}`,
       },
      }).then((response)=>{
        if (response.data.list.entries === !null){
        setLatestVersion(response.data.list.entries[0].entry.id)}
        else setLatestVersion("1.0")
    })
    }

    return(
        <Fragment>
            <div className="pdf-preview">
                <div id="details-pdf" className="pdf_details">
                    <div className="details-p">
                        <button className="shareLink"
                        onClick={()=> (DocumentShare())}>
                        <FontAwesomeIcon className="Icon" icon={faShareAlt}/>Click here to share</button> 

                        <p className="top-heaading">Document Type:{documentType} </p>
                   
                        <p>Created By: {createdBy}</p>
                        <p>Created On: {createdAt}</p>
                        <p>Last Modified: {modificationDate}</p>
                        <p>File Size: {bytesToSize(docSize.sizeInBytes)}</p>

                        <p>Activities:</p>  
                        {auditDetails.map((audit) =>(
                            <p> {audit.action} by {audit.user} on {audit.time}</p>
                        ))}

                        <p> <button id="audit-trail" 
                            onClick={() => {handleOnClick()}}>
                            (click to view detailed history)</button></p>

                        <p>Current Version: {latestVersion}</p>
                    </div>

                </div>
            </div>
        </Fragment>
     ) }

export default DocumentDetails; 