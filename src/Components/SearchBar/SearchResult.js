import React, {useEffect,useState,Fragment} from 'react';
import { useParams , useHistory } from 'react-router-dom';
import { Item } from '../backButton/backButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import { faTimesCircle, faFile , faFolder} from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios';
import { getToken,getUrl } from  "../../Utils/Common";
// import { instance } from '../ApiUrl/endpointName.instatnce';

function SearchResult(){
  let history = useHistory();
  const[documents,setDocuments]=useState([]);

   let params = useParams();
   const result = params.result;
   
useEffect(()=>{
  trackPromise(
        Axios.get(getUrl()+`alfresco/s/slingshot/search?term=${result}`,
        {
          headers:
          {
            Authorization: `Basic ${btoa(getToken())}`
          }
          }).then((response) => {
        console.log(response.data)
        setDocuments(response.data.items)
      }).catch((error) => {
        console.log(error);
      }
      )
  )
    },[result]);

    function handleDocument(id , name , type){
      type === "document" ? history.push(`/document-details/${id}/${name}`) : history.push(`/document/${id}`)
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
                    <th>Actions</th>
                    <th id="action"><Item/></th>
                  </tr>
                  </thead>
                  { documents.map((d) => (
                  <tbody key={d.nodeRef}>
                    <tr id="first_details">
                    <td className="file_name-u"  
                    onClick={() => handleDocument(
                      d.nodeRef.substring(24),
                      d.name,
                      d.type)}
                   ><FontAwesomeIcon 
                   className="pdf-file fas fa-file-pdf" 
                     icon={d.type === "document" ? faFile : faFolder} 
                       />
                    {d.name}</td>
                    <td className="details-u-s">{d.path}</td>
                    <td className="delete-u-s">
                    <FontAwesomeIcon className="fas fa-times-circle" icon={faTimesCircle} />
                  </td>
                  </tr>
                </tbody>
                ) )}
              </table>
              <LoadingIndicator/>
            </div>
            </div>

      <div className="col-md-6">
      
        </div>
    </Fragment>

          )
          }

export default SearchResult;