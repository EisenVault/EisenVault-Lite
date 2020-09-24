import React, {useEffect,useState,Fragment} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf,faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import ProfilePic from "../Avtar/Avtar";
import Axios from 'axios';
import alertify from 'alertifyjs';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import './ManageShares.scss';
import { useHistory } from 'react-router-dom';
import Search from "../SearchBar/SearchBar";
import { getToken, getUrl , getUser} from '../../Utils/Common';
import Pagination from '../Pagination/Pagination';

function ManageShares(){
  let history = useHistory();
  let count=0;
  const[FileState,setFileState]=useState([]);
  const[DetailsState,setDetailsState]=useState([]);
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [hasMoreItems , setMoreItems] = useState('');
  const [skipCount , setSkipCount ] = useState('');
  const [totalitems,settotalitems]=useState('')

 //API CALL
 useEffect(()=>{
  getDetailsData();
},[])
 
 const getDetailsData = () => {
  trackPromise(
  Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/shared-links?skipCount=0&maxItems=10&include=properties&where=(sharedByUser='-me-')`,
  {headers:
    {
      Authorization: `Basic ${btoa(getToken())}`
    }}
  ).then((response) => { 
  setFileState(response.data.list.entries)
  setSkipCount(response.data.list.pagination.skipCount +10)
  settotalitems(response.data.list.pagination.totalItems)
  setMoreItems(response.data.list.pagination.hasMoreItems)
  response.data.list.entries.forEach(d=>{
      Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.entry.nodeId}?include=properties`,
      {headers:
        {
          Authorization: `Basic ${btoa(getToken())}`
        }}
      ).then((response) => {
      setDetailsState(DetailsState => [...DetailsState, {entry:{EFFECTIVEFROM:response.data.entry.properties["cm:from"],
                                        EFFECTIVETO:response.data.entry.properties["cm:to"],
                                      NAME:response.data.entry.name}}])
    })
      .catch((error)=> console.log(error));
    }) 
}))
  }

function handleDocument(id,title){
  history.push(`/document-details/${id}/${title}`)
}

function handleDelete(id){
  Axios.delete(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/shared-links/${id}`,
  {headers:
    {
      Authorization: `Basic ${btoa(getToken())}`
    }}).then(response => {
    alertify.confirm().destroy();
    alertify.alert('Document Unshared Successfully').setting({
      'message': 'Document Unshared Successfully',
      'onok': () => {alertify.alert().destroy();} 
    }); 
  }).catch(error => {
    if (error.response.status===404){
      alert("Something went wrong!!");
    }
});
}


  function next(){
    
    var localSkipCount = skipCount;
    if (lastButtonClicked === "previous")
    {
    if(totalitems>=20){
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
    Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/shared-links?&maxItems=10&skipCount=${localSkipCount}&include=properties&where=(sharedByUser='-me-')`,
    {headers:
      {
        Authorization: `Basic ${btoa(getToken())}`
      }}
    ).then((response) => {
      setFileState(response.data.list.entries)
      response.data.list.entries.forEach(d=>{
       Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.entry.nodeId}?include=properties`,
        {headers:
          {
            Authorization: `Basic ${btoa(getToken())}`
          }}
        ).then((response) => {
        DetailsState.map(r => {
          if(response.data.entry.name === r.entry.NAME ){
                count=count+1   
            }
            })
        if(count>0){
          setDetailsState(DetailsState => [...DetailsState])
        } 
        else{
          setDetailsState(DetailsState => [...DetailsState, {entry:{EFFECTIVEFROM:response.data.entry.properties["cm:from"],
          EFFECTIVETO:response.data.entry.properties["cm:to"],
          NAME:response.data.entry.name}}])
        }  
      }) 
        .catch((error)=> console.log(error)) 
      })
        setMoreItems(response.data.list.pagination.hasMoreItems)
      if (response.data.list.pagination.hasMoreItems){
        setSkipCount(response.data.list.pagination.skipCount + 10)
        document.getElementById("myBtn").disabled = false;
      }
      else{
        document.getElementById("myBtn").disabled = true;
      }
      setLastButtonClicked("next");
      });
  }

    function previous(){
      var localSkipCount = skipCount;
      if (lastButtonClicked === "next") {
        if(localSkipCount<=20){
           localSkipCount = localSkipCount - 10;
        }
        else{
      localSkipCount = localSkipCount - 20;}
    }
      document.getElementById("myBtn").disabled = false;
      Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/shared-links?&include=properties&maxItems=10&skipCount=${localSkipCount}&where=(sharedByUser='-me-')`,
      {headers:
        {
          Authorization: `Basic ${btoa(getToken())}`
        }}
      ).then((response) => {
        setFileState(response.data.list.entries)
        response.data.list.entries.forEach(d=>{
          Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.entry.nodeId}?include=properties`,
          {headers:
            {
              Authorization: `Basic ${btoa(getToken())}`
            }}
          ).then((response) => {
        })
          .catch((error)=> console.log(error));
        }) 
         setMoreItems(response.data.list.pagination.hasMoreItems)
          if (response.data.list.pagination.skipCount > 0){
            setSkipCount(response.data.list.pagination.skipCount - 10)
            document.getElementById("myprevBtn").disabled = false;
          }
          else{
            document.getElementById("myprevBtn").disabled = true;
          }
          setLastButtonClicked("previous")
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
              };


export default ManageShares;