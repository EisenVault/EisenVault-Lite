import React,{Fragment, useEffect, useState} from 'react';
import './styleDashboard.scss';
import { useParams, useHistory } from 'react-router-dom';

import { getToken, getUser, getUrl } from "../../Utils/Common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faEye } from "@fortawesome/free-solid-svg-icons";
import Search from "../SearchBar/SearchBar";
import ProfilePic from "../Avtar/Avtar";
import Pagination from '../Pagination/Pagination';
// import { instance } from '../ApiUrl/endpointName.instatnce';
import axios from 'axios';

const Dashboard = () => {
  let personId = getUser();
  let history = useHistory();
  let params = useParams();
  const id = params.id;
  
  const [ documents , setDocuments ] = useState([]);
  const [hasMoreItems , setMoreItems] = useState('');
  const [skipCount , setSkipCount ] = useState('');

  //API call to get the activities list.
  useEffect(() => {
    axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/people/${personId}/activities?skipCount=0&who=me&maxItems=10`,
    {headers:{
      Authorization: `Basic ${btoa(getToken())}`
    }}).then((response) => {
      setDocuments(response.data.list.entries)
      setMoreItems(response.data.list.pagination.hasMoreItems)
      setSkipCount(response.data.list.pagination.skipCount + 10)
      console.log(response.data.list.entries)
      console.log(response.data.list.pagination)
    });
  }, []);

  function next(){
  
    //  setSkipCount(skipCount + 10)
     console.log(skipCount);
     axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/people/${personId}/activities?skipCount=${skipCount}&who=me&maxItems=10`,
     {headers:{
       Authorization: `Basic ${btoa(getToken())}`
     }}).then((response) => {
       setDocuments(response.data.list.entries)
       setMoreItems(response.data.list.pagination.hasMoreItems)
       setMoreItems(response.data.list.pagination.hasMoreItems)
     if (response.data.list.pagination.hasMoreItems){
      setSkipCount(response.data.list.pagination.skipCount + 10)
     }
     else{
      setSkipCount(response.data.list.pagination.skipCount - 10)
     }
       console.log(response.data.list.entries)
       console.log(response.data.list.pagination.skipCount)
     });
   
  }

  function previous(){
      axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/people/${personId}/activities?skipCount=${skipCount}&who=me&maxItems=10`,
      {headers:{
        Authorization: `Basic ${btoa(getToken())}`
      }}).then((response) => {
        setDocuments(response.data.list.entries)
        setMoreItems(response.data.list.pagination.hasMoreItems)
        if (response.data.list.pagination.skipCount > 0){
          setSkipCount(response.data.list.pagination.skipCount - 10)
        }
        else{
          setSkipCount(response.data.list.pagination.skipCount + 10)
        }
        console.log(response.data.list.entries)
        console.log(response.data.list.pagination)
        console.log(response.data.list.pagination.skipCount)
      });
   }

  function handleDocument(id,title){
    history.push(`/document-details/${id}/${title}`)
  }

  return (
  <Fragment>

      <div id="second_section">

      <div className="title">

        <h2>Dashboard</h2>
        <ProfilePic />
        </div>

        <div className="search-profile">
        <Search />
      </div>
      
      <div className="filesDetail">
        <h3>My Recent Activities</h3>

        <table className='documentsList'>
            {documents.map(document => (               
            <tbody key={document.entry.id} >
                <tr >
                  <td className='fileName'>                             
                    <FontAwesomeIcon icon={faFile} />
                        <h4>
                          {document.entry.activitySummary.title} 
                        </h4> 
                        <p className="text">{ " " }in { " " }</p> 
                          <h4>{document.entry.siteId}</h4> 
                          </td>
                          <td className='fileDetails'>
                            {document.entry.postedAt.split('T')[0]} </td>
                          <td className='fileActivity'>
                            {document.entry.activityType.split('.')[3]}</td>
                          <td className='view'
                          onClick={() => handleDocument(
                            document.entry.activitySummary.objectId,
                            document.entry.activitySummary.title) }>
                              <FontAwesomeIcon icon={faEye} /></td>
                      </tr>
                  </tbody>
            ))}
        </table>
      </div>
  </div>
  
    <div className="col-md-6">
     <Pagination
     handlePrev={previous}
     handleNext={next}
     hasMoreItems={hasMoreItems}
     skipCount={skipCount}
        />  
    </div>

  </Fragment>
  )
};

export default Dashboard;