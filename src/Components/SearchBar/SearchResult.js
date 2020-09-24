import React, {useEffect,useState,Fragment} from 'react';
import { useParams , useHistory } from 'react-router-dom';
import { Item } from '../backButton/backButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import { faTimesCircle, faFile , faFolder} from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios';
import { getToken,getUrl } from  "../../Utils/Common";
import Pagination from '../Pagination/Pagination';

function SearchResult(){
  let history = useHistory();
  const[documents,setDocuments]=useState([]);

   let params = useParams();
   const result = params.result;
   const [hasMoreItems , setMoreItems] = useState('');
  const [skipCount , setSkipCount ] = useState('');

  useEffect(()=>{
    trackPromise(
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

  function next(){
    document.getElementById("myprevBtn").disabled = false;
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
    
  function previous(){
    document.getElementById("myBtn").disabled = false;
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

    function handleDocument(id , name , type){
      type  ? history.push(`/document-details/${id}/${name}`) : history.push(`/document/${id}`)
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
        <Pagination
          handlePrev={previous}
          handleNext={next}
              />  
      </div>
    </Fragment>

          )
          }

export default SearchResult;