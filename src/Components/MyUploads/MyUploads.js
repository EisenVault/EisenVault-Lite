import React, {useEffect,useState,Fragment} from 'react'
import NestedToolTipuploads from '../UI/uploadPopups';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile,faFolder,faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import './MyUploads.scss';
import { useHistory } from 'react-router-dom';
import Search from "../SearchBar/SearchBar";
import Axios from 'axios';
import { getToken,getUser, getUrl} from '../../Utils/Common';
import ProfilePic from "../Avtar/Avtar";
import Pagination from '../Pagination/Pagination';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import alertify from 'alertifyjs';
// import { instance } from '../ApiUrl/endpointName.instatnce';

function MyUploads(props){
  let history = useHistory();

  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const[FileState,setFileState]=useState([]);
  useEffect(()=>{
    getData();
  },[]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [postsPerPage] = useState(10);
  //const [ paginationDefualt, setPaginationDefault ] = useState([]);
  const [hasMoreItems , setMoreItems] = useState('');
  const [skipCount , setSkipCount ] = useState('');

  //api call 
    const getData=()=>{
      trackPromise(
      Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
      {
        "query": 
          {"query": `cm:creator:${getUser()}`},
          "paging": {
            "maxItems": "10",
            "skipCount": "0"
          }
      },
       {headers:{
        Authorization: `Basic ${btoa(getToken())}`
         }}).then((response)=>{
             let FileData=response.data;
             console.log(FileData);
            //setPaginationDefault(response.data.totalRecords) 
            setMoreItems(response.data.list.pagination.hasMoreItems)
            setSkipCount(response.data.list.pagination.skipCount + 10)
            setFileState(FileData.list.entries.map(d=>{
              return {
                select:false,
                id:d.entry.id,
                name:d.entry.name,
                uploadedOn:d.entry.createdAt.split('T')[0],
                type:d.entry.isFile
              }
            })) 
            }).catch(err=>alert(err))
      )
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = FileState.slice(indexOfFirstPost, indexOfLastPost);

  const closeModal=()=>{ //function to close modal after performing it's operations
    return  setmodalIsOpen(false)
  }
  
  //arrow function for getting file nodeid and putting it dynamically in api to delete single/multiple files
  const deleteFileByIds=(close)=>{
    FileState.forEach( d=>{
      if(d.select){
       Axios.delete(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.id}`, 
      {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          console.log(data);
          close();
          alertify.alert('Document Deleted Successfully').setting({
            'message': 'Document Deleted Successfully',
            'onok': () => {alertify.alert().destroy();} 
          });
          getData();
           }).catch(err=>alert(err));
       };
      })}
      
       const DefaultDelete=(close)=>{
        FileState.forEach( d=>{
          if(d.id){
          Axios.delete(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.id}`, 
          {headers:{
          Authorization: `Basic ${btoa(getToken())}`
           }
         }).then((data)=>{
              console.log(data);
              close();
              alertify.alert('Document Deleted Successfully').setting({
                'message': 'Document Deleted Successfully',
                'onok': () => {alertify.alert().destroy();} 
              });
              getData();
               }).catch(err=>alert(err));
           };
          })
      }

      const handleDelete=(id)=>{  //method to delete document without selecting by checkbox
        Axios.delete(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}`, 
      {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          console.log(data);
          alertify.confirm().destroy();
          alertify.alert('Document Deleted Successfully').setting({
            'message': 'Document Deleted Successfully',
            'onok': () => {alertify.alert().destroy();} 
          }); 
          getData();
           }).catch(err=>alert(err));
      }

      function next(){
        document.getElementById("myprevBtn").disabled = false;
        Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
        {
          "query": 
            {"query": `cm:creator:${getUser()}`},
            "paging": {
              "maxItems": "10",
              "skipCount": `${skipCount}`
            }
        },
        {headers:{
           Authorization: `Basic ${btoa(getToken())}`
         }}).then((response) => {
          setFileState(response.data.list.entries.map(d=>{
            return {
              select:false,
              id:d.entry.id,
              name:d.entry.name,
              uploadedOn:d.entry.createdAt.split('T')[0],
              type:d.entry.isFile
            }
          }))
           setMoreItems(response.data.list.pagination.hasMoreItems)
         if (response.data.list.pagination.hasMoreItems){
          setSkipCount(response.data.list.pagination.skipCount + 10)
          document.getElementById("myBtn").disabled = false;
         }
         else{
          document.getElementById("myBtn").disabled = true;
         }
         
       console.log(response.data.list.entries)
       console.log(response.data.list.pagination.skipCount)
         });
       
      }
    
      function previous(){
        document.getElementById("myBtn").disabled = false;
        Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
        {
          "query": 
            {"query": `cm:creator:${getUser()}`},
            "paging": {
              "maxItems": "10",
              "skipCount": `${skipCount}`
            }
        },
        {headers:{
           Authorization: `Basic ${btoa(getToken())}`
         }}).then((response) => {
          setFileState(response.data.list.entries.map(d=>{
            return {
              select:false,
              id:d.entry.id,
              name:d.entry.name,
              uploadedOn:d.entry.createdAt.split('T')[0],
              type:d.entry.isFile
            }
          }))
          setMoreItems(response.data.list.pagination.hasMoreItems)
          if (response.data.list.pagination.skipCount > 0){
            setSkipCount(response.data.list.pagination.skipCount - 10)
            document.getElementById("myprevBtn").disabled = false;
          }else{
            document.getElementById("myprevBtn").disabled = true;
          }
          console.log(response.data.list.entries)
          console.log(response.data.list.pagination)
          console.log(response.data.list.pagination.skipCount)
        }); }

        function handleDocument(file , id, title){
          file ? history.push(`/document-details/${id}/${title}`)
          : history.push(`/document/${id}`)
        }
      return( 
      <Fragment>
         <div id="second_section">

         <div className="title">
            <ProfilePic />
            <h2>My Uploads</h2>
          </div>

          <div className="search-profile">
            <Search />
          </div>

              <div className="filesUpload">
                <table id="doc_list">
                  <tbody>
                  <tr id="icons">
                    <th id="icon01">
                      <input type="checkbox" onChange={(e)=>{
                        let checked=e.target.checked;
                        setFileState(FileState.map((d)=>{
                          d.select=checked;
                          return d;
                        }));
                      }}/>
                    </th>
                    <th id="item-name">Item Name</th>
                    <th id="shared">Uploaded On</th>
                    <th id="action">
                      <NestedToolTipuploads del={DefaultDelete} delsel={deleteFileByIds}/>
                      {/* <label>Action </label>
                      <select id="action-t" onChange={() => {setmodalIsOpen(true);}}>
                        <option id="option" value="delete-a">Delete All</option>
                        <option id="option" value="delete-s">Delete Selected</option>
                      </select> */}
                    </th>
                </tr> 
                  
                  { FileState.map((d) => (
                     <tr  key={d.id}  id="first_details">
                    <td className="file_icon1">
                      <input onChange={(event)=>{
                          let checked=event.target.checked;
           
                        setFileState(FileState.map((data)=>{
                          if(d.id===data.id){
                            data.select=checked;
                          }return data;
                         }));
                      }} type="checkbox" checked={d.select} />
                      </td>
                      
                    <td className="file_name-u"
                    onClick={() => handleDocument(
                      d.type,
                      d.id,
                      d.name) }>
                    <FontAwesomeIcon className="pdf-file fas fa-file-pdf" 
                     icon={d.type ? faFile : faFolder}/> 
                    {d.name}</td>
                    <td className="details-u">{d.uploadedOn}</td>
                    <td className="delete-u">
                    <FontAwesomeIcon className="fas fa-times-circle" icon={faTimesCircle} 
                     onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                     buttonFocus : "ok",
                     'message' : 'DO YOU WANT TO DELETE THIS FILE '+ d.name,'onok': () => {handleDelete(d.id)} ,
                     'oncancel': () => {alertify.confirm().destroy();}}).show()
                        }} 
                      />
                </td>
              </tr>
                ))}
             </tbody>  
            </table>
            <LoadingIndicator/>   
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
          }
export default MyUploads;
