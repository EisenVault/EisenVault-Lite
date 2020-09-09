import React, {useEffect,useState,Fragment} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf,faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import ProfilePic from "../Avtar/Avtar";
import Axios from 'axios';
import alertify from 'alertifyjs';
import './ManageShares.scss';
import { useHistory } from 'react-router-dom';
import Search from "../SearchBar/SearchBar";
import { getToken, getUrl } from '../../Utils/Common';
import Pagination from '../Pagination/Pagination';
// import {instance} from "../ApiUrl/endpointName.instatnce"

function ManageShares(){
  let history = useHistory();
  const[FileState,setFileState]=useState([]);
  const[DetailsState,setDetailsState]=useState([]);

  const [ currentPage, setCurrentPage ] = useState(1);
  const [postsPerPage] = useState(10);
  const [hasMoreItems , setMoreItems] = useState('');
  const [skipCount , setSkipCount ] = useState('');

 //API CALL
 useEffect(()=>{
  getDetailsData();
},[])
 
 const getDetailsData = () => {
  Axios.get(getUrl()+'/alfresco/api/-default-/public/alfresco/versions/1/shared-links?skipCount=0&maxItems=10&include=properties',
  {headers:
    {
      Authorization: `Basic ${btoa(getToken())}`
    }}
  ).then((response) => { 
  setFileState(response.data.list.entries)
  console.log(response.data)
  response.data.list.entries.forEach(d=>{
      Axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.entry.nodeId}?include=properties`,
      {headers:
        {
          Authorization: `Basic ${btoa(getToken())}`
        }}
      ).then((response) => {
        console.log("received")
      console.log(response.data)
      setDetailsState(DetailsState => [...DetailsState, {entry:{EFFECTIVEFROM:response.data.entry.properties["cm:from"],
                                        EFFECTIVETO:response.data.entry.properties["cm:to"],
                                      NAME:response.data.entry.name}}])
      console.log(DetailsState)
    })
      .catch((error)=> console.log(error));
    }) 

});
  }
  console.log(DetailsState)
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = FileState.slice(indexOfFirstPost, indexOfLastPost);

function handleDocument(id,title){
  history.push(`/document-details/${id}/${title}`)
}

function handleDelete(id){
  Axios.delete(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/shared-links/${id}`,
  {headers:
    {
      Authorization: `Basic ${btoa(getToken())}`
    }}).then(response => {
    alertify.confirm().destroy();
    alert("unshared"); 
    console.log(response)
  }).catch(error => {
    if (error.response.status===404){
      alert("Something went wrong!!");
    }
    console.log(error)
});
}

function next(){
  
  //  setSkipCount(skipCount + 10)
   console.log(skipCount);
   Axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/shared-links?&maxItems=10&skipCount=${skipCount}&include=properties`,
   {headers:
     {
       Authorization: `Basic ${btoa(getToken())}`
     }}
   ).then((response) => {

    console.log(response.data)
     setMoreItems(response.data.list.pagination.hasMoreItems)
     if (response.data.list.pagination.hasMoreItems){
      setSkipCount(response.data.list.pagination.skipCount + 10)
     }
     else{
      setSkipCount(response.data.list.pagination.skipCount - 10)
     }
    });
 
}

function previous(){
  Axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/shared-links?&include=properties&maxItems=10&skipCount=${skipCount}`,
  {headers:
    {
      Authorization: `Basic ${btoa(getToken())}`
    }}
  ).then((response) => {

      setMoreItems(response.data.list.pagination.hasMoreItems)
      if (response.data.list.pagination.skipCount > 0){
        setSkipCount(response.data.list.pagination.skipCount - 10)
      }
      else{
        setSkipCount(response.data.list.pagination.skipCount + 10)
      }
     });
 }

return( 
      <Fragment>
       
         <div id="second_section">
         <div className="title">
            <h2>Manage Shares</h2>
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
                    <th id="shared">Effective From</th>
                    <th id="shared">Effective To</th>
                    <th id="action">Action</th>
                  </tr>
                  </thead>
                  
                  { FileState.map((d) => (
                    <tbody key={d.entry.nodeId}>
                    <tr  id="first_details"  >
                    {/* <tr  key={d.entry.id} id="first_details"> */}
                    <td className="file_name-u"  onClick={() => handleDocument(
                            d.entry.nodeId,
                            d.entry.name) }>
                    <FontAwesomeIcon className="pdf-file fas fa-file-pdf" icon={faFilePdf}/> 
                    {d.entry.name}</td>
                    
                  {DetailsState.map(r => (
                    d.entry.name === r.entry.NAME ?
                      
                      <td className="details-u-s" key={r.entry.NAME}>{r.entry.EFFECTIVEFROM ? r.entry.EFFECTIVEFROM.split('T')[0]  : null}</td>
                     : null
                    ))}
                    {DetailsState.map(r => (
                    d.entry.name === r.entry.NAME ?
                      <td className="details-u-s" key={r.entry.NAME}>{r.entry.EFFECTIVETO ? r.entry.EFFECTIVETO.split('T')[0] : null}</td>
                    : null
                    ))}
                    <td className="delete-u-s">
                    <FontAwesomeIcon className="fas fa-times-circle" icon={faTimesCircle} 
                      onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                      buttonFocus : "ok",
                      'message' : 'DO YOU WANT TO UNSHARE THIS FILE '+ d.entry.name,'onok': () => {handleDelete(d.entry.id)} ,
                      'oncancel': () => {alertify.confirm().destroy();}}).show()
          }}/>
                  </td>
                  </tr>
                  </tbody>
                  ) )}
                   
                   
               
              </table>
            </div>
            </div>
      <div className="col-md-6">
      <Pagination
          handlePrev={previous}
          handleNext={next}
          hasMoreItems={hasMoreItems}
          skipCount={skipCount-10}

        />
      </div>
    </Fragment>
          )
          };


export default ManageShares;