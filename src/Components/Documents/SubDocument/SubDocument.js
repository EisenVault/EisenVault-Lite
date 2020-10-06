/******************************************
* File: SubDocument.js
* Desc: This page gives list of folder, files or subfolders of a department, we can preview a file and delete it.
* @param: (1) nodeId of a folder.
* @returns: all files , folders and subfolders
* @author: Shrishti Raghav, 6 October 2020
********************************************/

import React, {useEffect,useState,Fragment} from 'react';
import { useParams , useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Item } from '../../backButton/backButton';
import alertify from 'alertifyjs';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../../Utils/LoadingIndicator';
import { faFile,faTimesCircle,faFolder} from "@fortawesome/free-solid-svg-icons";
import Pagination from '../../Pagination/Pagination';
import Search from "../../SearchBar/SearchBar";
import ProfilePic from "../../Avtar/Avtar";
import {getToken,getUrl} from "../../../Utils/Common";
import './SubDocument.scss';
import Axios from 'axios';

function SubDocument(){
  let history = useHistory();
  let params = useParams();
  //node id of document
  const id = params.id;
  const[documents,setDocuments]=useState([]);
  const [ paginationDefualtDoc, setPaginationDefaultDoc ] = useState([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [postsPerPage] = useState(10);
  const [hasMoreItems , setMoreItems] = useState('');
  const [totalitems,settotalitems]=useState('');
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [skipCount , setSkipCount ] = useState(0);
  
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = documents.slice(indexOfFirstPost, indexOfLastPost);
  
  useEffect(()=>{
    getData()
  },[id]);

  const getData = () => {
      /**
   * Track the api call promise helps the show the loading indicator till the api fetch a results.
   *
   * @return  A loading indicator.
   */
    trackPromise(
    Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/children?skipCount=0&maxItems=10`,
    {
    headers:{
        Authorization: `Basic ${btoa(getToken())}`
        } }).then((response) => {
    console.log(response.data)
    setDocuments(response.data.list.entries)
    setSkipCount(response.data.list.pagination.skipCount + 10)
    setPaginationDefaultDoc(response.data.list.pagination) 
    console.log(response.data.list.pagination)
    })
    )
  };
 
/**
 * Function to delete a document .
 *
 * @param {number} id The node Id of document.
 * @return  alert message of successfully deleted on success or an alert of failure.
 */
const handleDelete=(id)=>{
      Axios.delete(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}`,
      {
      headers:{
          Authorization: `Basic ${btoa(getToken())}`
          } }
      ).then((data)=>{
          console.log(data);
          alertify.confirm().destroy();
          alertify.alert('Document Deleted Successfully').setting({
            'onok': () => {alertify.alert().destroy();} 
          }); 
          getData();
           }).catch(err=>alert(err));
      }
    
      /**
   * Fetch next 10 documents and update the list of documents.
   *
   * @return  updated list of documents to display.
   */
      function next(){
        var localSkipCount = skipCount;
        if (lastButtonClicked === "previous")
               {
                if(totalitems>20){
                 if(localSkipCount===0)
                   {
                     localSkipCount=localSkipCount + 10 
                   }else{
                    localSkipCount = localSkipCount + 20;}
                }
              else{
                localSkipCount=localSkipCount + 0 ;
              }}
         document.getElementById("myprevBtn").disabled = false;
         Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/children?skipCount=${localSkipCount}`,    
              {headers:{
           Authorization: `Basic ${btoa(getToken())}`
         }}).then((response) => {
          setDocuments(response.data.list.entries)
          setPaginationDefaultDoc(response.data.list.pagination) 
          setMoreItems(response.data.list.pagination.hasMoreItems)
          if (response.data.list.pagination.hasMoreItems)
          {
            setSkipCount(response.data.list.pagination.skipCount + 10)
            document.getElementById("myBtn").disabled = false;
           }
           else{
            document.getElementById("myBtn").disabled = true;
           }
           setLastButtonClicked("next");
         }); 
      }
        
      /**
   * Fetch previous 10 documents and update the list of documents.
   *
   * @return  updated list of documents to display.
   */
      function previous(){
        var localSkipCount = skipCount;
        if (lastButtonClicked === "next") {
          if(localSkipCount===10){
              localSkipCount = localSkipCount - 10;
          }
          else{
         localSkipCount = localSkipCount - 20;}
      }
       document.getElementById("myBtn").disabled = false;
       Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}/children?skipCount=${localSkipCount}`,
        {headers:{
          Authorization: `Basic ${btoa(getToken())}`
        }}).then((response) => {
         setDocuments(response.data.list.entries)
         setPaginationDefaultDoc(response.data.list.pagination) 
         setMoreItems(response.data.list.pagination.hasMoreItems)
          if (response.data.list.pagination.skipCount > 0)
          {
            setSkipCount(response.data.list.pagination.skipCount - 10)
            document.getElementById("myprevBtn").disabled = false;
          }
          else{
            document.getElementById("myprevBtn").disabled = true;
           }
           setLastButtonClicked("previous")
          });
       }
    
    
  /**
   * Redirects to document preview page or subfolder page based on type of document.
   *
   * @param {number} id The node Id of document.
   * @param {text} name The name of document.
   * @param {Boolean} file true if document is a file else false.
   * @return  Redirects to a new page.
   */
    function handleDocument(file , id, title){
      file ? history.push(`/document-details/${id}/${title}`)
      : history.push(`/document/${id}`)
    }

    return( 
      <Fragment>
         <div id="second_section">
         <div className="title">
            <h2>Document Library</h2>
            <ProfilePic />
            </div> 

            <div className="search-profile">
            <Search />
            </div> 
            
              <div className="filesShared">
                <table id="doc_list">
                  <thead>
                  <tr id="icons">
                    <th id="item-names">Item Name</th>
                    <th id="shared">Created By</th>
                    <th id="shared">Created On</th>
                    <th id="shared">Modified On</th>
                    <th>Actions</th>
                    <th id="action"><Item /></th>
                  </tr>
                  </thead>
                  { currentPosts.map((d) => (
                  <tbody key={d.entry.id}>
                    <tr id="first_details">
                    <td className="file_name-u" 
                    onClick={() => handleDocument(
                      d.entry.isFile,
                      d.entry.id,
                      d.entry.name)}>
                      <FontAwesomeIcon 
                      className="pdf-file fas fa-file-pdf" 
                        icon={d.entry.isFile ? faFile : faFolder} 
                          />
                       {d.entry.name}</td>
                    <td className="details-u-s">{d.entry.createdByUser.displayName}</td>
                    <td className="details-u-s">{d.entry.createdAt.split('T')[0]}</td>
                    <td className="details-u-s">{d.entry.modifiedAt.split('T')[0]}</td>
                    <td className="delete-u-s-action">
                    <FontAwesomeIcon className="fas fa-times-circle" icon={faTimesCircle}

                    onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                                buttonFocus : "ok",
                                'message' : 'DO YOU WANT TO DELETE THIS FILE '+ d.entry.name,'onok': () => {handleDelete(d.entry.id)} ,
                                'oncancel': () => {alertify.confirm().destroy();}}).show()
                    }} />
                  </td>
                  </tr>
                </tbody>
                ) )}
              </table>
              <LoadingIndicator/>

            </div>
            </div>
      <div className="col-md-6">
      <Pagination
       handlePrev={previous}
       handleNext={next}
        />
     
        </div>
    </Fragment>
          )
    }
export default SubDocument;