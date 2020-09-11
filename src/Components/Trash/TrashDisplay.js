import React, { Fragment,useEffect,useState} from 'react';
import Modal from "../Modal/Modal";
import { DeleteSummmary,RestoreSummary } from "../Modal/DeleteModalSumm/DeleteSumm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faUndo,faFile,faFolder} from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios';
import Pagination from '../Pagination/Pagination';
import Search from '../SearchBar/SearchBar';
// import '../MyUploads/MyUploads.scss';
import alertify from 'alertifyjs';
import './TrashDisplay.scss';
import '../../Containers/styles.scss';
import { getToken,getUrl } from '../../Utils/Common';
import ProfilePic from "../Avtar/Avtar";
import NestedToolTip from "../UI/popup";
// import { instance } from '../ApiUrl/endpointName.instatnce';

function TrashDisplayFiles(props){
  const[TrashFileState,setTrashFileState]=useState([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const[deleting,deleteHandler]=useState(false);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [postsPerPage] = useState(10);
  const [ paginationDefualt, setPaginationDefault ] = useState([]);
  const [hasMoreItems , setMoreItems] = useState('');
  const [skipCount , setSkipCount ] = useState('');
  const [count,setCount]=useState('');
  const[Entrieslength,setEntrieslength]=useState('')

  //API CALL
  useEffect(()=>{
    getDeletedData();
  },[]);

const getDeletedData=()=>{
  Axios.get(getUrl()+'alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes?skipCount=0&maxItems=50',
    {headers:{
    Authorization: `Basic ${btoa(getToken())}`
     }}).then((response) => {
      let FileData=response.data;
      console.log(FileData);
      setPaginationDefault(response.data.list.pagination)
      setSkipCount(response.data.list.pagination.skipCount+10)
      setTrashFileState(response.data.list.entries.map(d=>{
        return {
          select:false,
          id:d.entry.id,
          name:d.entry.name,
          createdOn:d.entry.createdAt.split('T')[0],
          archivedAt:d.entry.archivedAt.split('T')[0],
          type:d.entry.isFile
        }})) 
      }).catch(err=>alert(err));
};
// Get current posts
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = TrashFileState.slice(indexOfFirstPost, indexOfLastPost);


const closeModal=()=>{ //function to close modal after performing it's operations
  return (setmodalIsOpen(false),
  deleteHandler(false)
  )
}
//function to collect nodeid of deleted files
const permanentDeleteByIds=()=>{
  TrashFileState.forEach(d=>{
    if(d.select){
    Axios.delete(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${d.id}`, 
    {headers:{
    Authorization: `Basic ${btoa(getToken())}`
     }
   }).then((response)=>{
        console.log(response.data);
        closeModal();
        getDeletedData();
      
         }).catch(err=>alert(err));
     };
    })}

//function to collect nodeid of restored files
const RestoreFileByIds=()=>{
  TrashFileState.forEach(d=>{
    if(d.select){
       Axios.put(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${d.id}`, {},
        {headers:
        {
          Authorization: `Basic ${btoa( getToken() )}`
        }
    }).then((response)=>{
          console.log(response.data);
          closeModal();
          getDeletedData();
          }).catch(err=>alert(err));
      };
      })}

      const handleDelete=(id)=>{ //method to delete documents without selecting by checkbox
        Axios.delete(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${id}`, 
      {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          console.log(data);
          alertify.confirm().destroy(); 
          getDeletedData();
           }).catch(err=>alert(err));}
     
     const handleRestore=(id)=>{ //method to restore documents without selecting by checkbox
        Axios.put(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${id}`, {},
        {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          console.log(data);
          alertify.confirm().destroy(); 
          getDeletedData();
           }).catch(err=>alert(err));}
     
     
      function next(){  //function for pagination's next button
       document.getElementById("myprevBtn").disabled = false;
         console.log(skipCount);
         Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes?skipCount=${skipCount}&maxItems=10`,
         {headers:{
           Authorization: `Basic ${btoa(getToken())}`
         }}).then((response) => {
          console.log(response.data)
          setTrashFileState(response.data.list.entries.map(d=>{
            return {
              select:false,
              id:d.entry.id,
              name:d.entry.name,
              createdOn:d.entry.createdAt.split('T')[0],
              archivedAt:d.entry.archivedAt.split('T')[0]
            }})) 
            setCount(response.data.list.pagination.count)
              setSkipCount(response.data.list.pagination.skipCount+10)
              if(response.data.list.entries.length===0){
                document.getElementById("myBtn").disabled = true;  
              }
          });
        }
      
      function previous(){ 
        //function for pagination's previous button
        document.getElementById("myBtn").disabled = false;  
        Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes?skipCount=${skipCount}&maxItems=10`,
        {headers:{
          Authorization: `Basic ${btoa(getToken())}`
        }}).then((response) => {
          setTrashFileState(response.data.list.entries.map(d=>{
            return {
              select:false,
              id:d.entry.id,
              name:d.entry.name,
              createdOn:d.entry.createdAt.split('T')[0],
              archivedAt:d.entry.archivedAt.split('T')[0]
            }})) 
            setCount(response.data.list.pagination.count)
            if (response.data.list.pagination.skipCount >0){
              setSkipCount(response.data.list.pagination.skipCount - 10)
              document.getElementById("myprevBtn").disabled = false;
            }else{
              document.getElementById("myprevBtn").disabled = true;
            }
            console.log(response.data.list.pagination.skipCount)
           });
       }
      
  return(
    <Fragment>
        <div id="second_section">
        <div className="title">
          <h2>Trash</h2>
          <ProfilePic />
        </div>

        <div className="search-profile">
          <Search />
        </div>

        <div className="filesUpload">
        <table id="doc_list">
          <tbody>
            <tr id="icons">
                <th id="icon01">
                  <input type="checkbox"
                  onChange={(e)=>{
                    let checked=e.target.checked;
                    setTrashFileState(TrashFileState.map((d)=>{
                      d.select=checked;
                      return d;
                    }));
                  }}/></th>
                <th id="item_name">Item Name</th>
                <th id="created">Created on</th> 
                <th id="deleted">Deleted on</th>
                 <th id="action-trash">

                  <NestedToolTip restored={()=>{RestoreFileByIds()}} deleted={()=>{permanentDeleteByIds()}}/>
                  </th>  

                  <Modal show={deleting}>
                  <DeleteSummmary deleted={()=>{permanentDeleteByIds()}} 
                  clicked={()=>{deleteHandler(false)}}/>
                  </Modal>
                  
                  <Modal show={modalIsOpen}>
                  <RestoreSummary deleted={()=>{RestoreFileByIds()}} 
                  clicked={() => setmodalIsOpen(false)}/>
                  </Modal>
                </tr>
                
                {currentPosts.map((d,i) => (
                 <tr  key={d.id} id="first_details">
                 <td className="file_icon1">
                   <input onChange={(event)=>{
                      let checked=event.target.checked;
                    setTrashFileState(TrashFileState.map((data)=>{
                      if(d.id===data.id){
                        data.select=checked;
                      }return data;
                    }));
                   }} type="checkbox" checked={d.select}
                    /> </td> 
                 <td className="file_name-u">
                 <FontAwesomeIcon className="pdf-file fas fa-file-pdf" 
                     icon={d.type ? faFile : faFolder}/> 
                    {d.name}</td>         
                 <td className="created_t">{d.createdOn}</td>                     
                <td className="deleted_t">{d.archivedAt}</td> 
                <td className="delete-icon">
                <FontAwesomeIcon icon={faTrash} className="TrashIcon" 
                onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                buttonFocus : "ok",
                'message' : 'DO YOU WANT TO DELETE THIS FILE '+ d.name,'onok': () => {handleDelete(d.id)} ,
                'oncancel': () => {alertify.confirm().destroy();}}).show()
    }}/>
                <FontAwesomeIcon icon={faUndo} className="UndoIcon" 
                 onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                 buttonFocus : "ok",
                 'message' : 'DO YOU WANT TO RESTORE THIS FILE '+ d.name,'onok': () => {handleRestore(d.id)} ,
                 'oncancel': () => {alertify.confirm().destroy();}}).show()
      }}/>
                 </td></tr>
                ))}
        </tbody>
      </table>
    </div>
  </div>

  <div className="col-md-6">
      <Pagination
             handlePrev={previous}
             handleNext={next}
             hasMoreItems={hasMoreItems}
             skipCount={skipCount}
             Count={count}
        />
    </div>
</Fragment>
)
}
  export default TrashDisplayFiles;