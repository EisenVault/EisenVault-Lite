/******************************************
* File: SearchResult.js
* Desc: List the documents whih matches our search keyword or contain search keyword in its content.We can preiew documents, can see the full path of location where document actually exists.
* @param: (1) search keyword
* @returns: search result 
* @author: Shrishti Raghav, 6 October 2020
********************************************/

import React, {useEffect,useState,Fragment} from 'react';
import { useParams , useHistory } from 'react-router-dom';
import { Item } from '../backButton/backButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import alertify from 'alertifyjs';
import { faTimesCircle, faFile , faFolder} from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios';
import { getToken,getUrl } from  "../../Utils/Common";
import Pagination from '../Pagination/Pagination';

function SearchResult(){
  let history = useHistory();
  const[documents,setDocuments]=React.useState([]);

   let params = useParams();
   // search keyword
   const result = params.result;
   const [hasMoreItems , setMoreItems] = useState(false);
  const [skipCount , setSkipCount ] = useState(0);

  React.useEffect(()=>{
    /**
   * Track the api call promise helps the show the loading indicator till the api fetch a results.
   *
   * @return  A loading indicator.
   */
    trackPromise(
      // Api call to fetch search result
    Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
            {
              "query": {
                "query": `${result}`
              },
              "include": [ "properties","path"],
              "paging": {
                "maxItems": "10",
                "skipCount": "0"
              }
            },
            {
              headers:
              {
                Authorization: `Basic ${btoa(getToken())}`
              }
              }).then((response) => {
            setDocuments(response.data.list.entries)
          }).catch((error) => {
            console.log(error);
          }
          )
    )
  },[result])

  /**
   * Fetch next 10 documents and update the list of documents.
   *
   * @return  updated list of documents to display.
   */
  function next(){
    document.getElementById("myprevBtn").disabled = false;
    // Api call to fetch search result
    Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
    {
      "query": {
        "query": `${result}`
      },
      "include": [ "properties","path"],
      "paging": {
        "maxItems": "10",
        "skipCount": `${skipCount}`
      }
    },
    {headers:{
       Authorization: `Basic ${btoa(getToken())}`
     }}).then((response) => {
      setDocuments(response.data.list.entries)
       setMoreItems(response.data.list.pagination.hasMoreItems)
     if (response.data.list.pagination.hasMoreItems){
      setSkipCount(response.data.list.pagination.skipCount + 10)
      document.getElementById("myBtn").disabled = false;
     }
     else{
      document.getElementById("myBtn").disabled = true;
     }
     });
   
  }
  
  /**
   * Fetch previous 10 documents and update the list of documents.
   *
   * @return  updated list of documents to display.
   */
  function previous(){
    document.getElementById("myBtn").disabled = false;
    // Api call to fetch search result
    Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
    {
      "query": {
        "query": `${result}`
      },
      "include": [ "properties","path"],
      "paging": {
        "maxItems": "10",
        "skipCount": `${skipCount}`
      }
    },
    {headers:{
       Authorization: `Basic ${btoa(getToken())}`
     }}).then((response) => {
      setDocuments(response.data.list.entries)
      setMoreItems(response.data.list.pagination.hasMoreItems)
      if (response.data.list.pagination.skipCount > 0){
        setSkipCount(response.data.list.pagination.skipCount - 10)
        document.getElementById("myprevBtn").disabled = false;
      }else{
        document.getElementById("myprevBtn").disabled = true;
      }
    }); }

  /**
   * Redirects to document preview page or subfolder page based on type of document.
   *
   * @param {number} id The node Id of document.
   * @param {text} name The name of document.
   * @param {text} type The type of document.
   * @return  Redirects to a new page.
   */
    function handleDocument(id , name , type){
      type  ? history.push(`/document-details/${id}/${name}`) : history.push(`/document/${id}`)
   }
    
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
       }).catch(err=>alert(err));
  }
    return( 
      <Fragment>
         <div id="second_section">
            <h2>SearchResult</h2>
            

              <div className="filesShared">
                <table id="doc_list">
                  <thead>
                  <tr id="icons">
                    <th id="item-names">Item Name</th>
                    <th id="shared">Department Name</th>
                    <th id="action-title">Actions</th>
                    <th id="action"><Item/></th>
                  </tr>
                  </thead>
                  { documents.map((d) => (
                  <tbody key={d.entry.id}>
                    <tr id="first_details">
                    <td className="file_name-u"  
                    onClick={() => handleDocument(
                      d.entry.id,
                      d.entry.name,
                      d.entry.isFile)}
                   ><FontAwesomeIcon 
                   className="pdf-file fas fa-file-pdf" 
                     icon={d.entry.isFile  ? faFile : faFolder} 
                       />
                    {d.entry.name}</td>
                    <td className="details-u-s">{d.entry.path.name}</td>
                    <td className="delete-u-s">
                    <FontAwesomeIcon className="fas fa-times-circle" icon={faTimesCircle} 
                     onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                     buttonFocus : "ok",
                     'message' : 'DO YOU WANT TO DELETE THIS FILE '+ d.entry.name,'onok': () => {handleDelete(d.entry.id)} ,
                     'oncancel': () => {alertify.confirm().destroy();}}).show()
         }}
                    />
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

export default SearchResult;