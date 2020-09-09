import React,{Fragment , useEffect , useState} from 'react';
import {getToken,getUser,getUrl} from "../../Utils/Common";
import ProfilePic from "../Avtar/Avtar";

import { useHistory} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faGlobeAsia } from "@fortawesome/free-solid-svg-icons";
import './DocumentList.scss';
import alertify from 'alertifyjs';
// import {instance} from "../ApiUrl/endpointName.instatnce"
import Search from "../SearchBar/SearchBar";


import Modal from "../Modal/Modal";
import { DeleteDepartment} from "../Modal/DeleteModalSumm/DeleteSumm";
import Pagination from '../Pagination/Pagination';
import Axios from 'axios';

const DocumentsList = () => {
  const user = getUser();
  const [createmodalIsOpen, createsetmodalIsOpen] = useState(false);
  // const [editmodalIsOpen, editsetmodalIsOpen] = useState(false);
  const [deletemodalIsOpen, deletesetmodalIsOpen] = useState(false);
  const [ paginationDefualtDept, setPaginationDefaultDept ] = useState([]);
  let history = useHistory();
  let url;
  const [ departments , setDepartments ] = useState([]);
  const [ documents , setDocuments ] = useState([]);
  
  const [ currentPage, setCurrentPage ] = useState(1);
  const [postsPerPage] = useState(10);
  const departmentTitle = useFormInput ('');
  const [hasMoreItems , setMoreItems] = useState('');

  const [skipCount , setSkipCount ] = useState(0);
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = departments.slice(indexOfFirstPost, indexOfLastPost);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //Condition to fetch departments
    if(user === "admin")
    {
     url=`/sites?`
    }
    else{
      url = "/sites?where=(visibility='PRIVATE')&"
    }
  
  useEffect(()=>{
    getDepartments();
  },[url]);
  
  const getDepartments=()=>{
    Axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/${url}maxItems=10&skipCount=0`,
    {
    headers:{
        Authorization: `Basic ${btoa(getToken())}`
        }}).then((response) => {
      console.log(response.data)
      setDepartments(response.data.list.entries)
      setPaginationDefaultDept(response.data.list.pagination)
      setMoreItems(response.data.list.pagination.hasMoreItems) 
      setSkipCount(response.data.list.pagination.skipCount + 10)
      console.log(response.data.list.pagination)     
    });
  }

function handleDocumentLibrary(key){
  Axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${key}/children`,
  {
  headers:{
      Authorization: `Basic ${btoa(getToken())}`
      }
    }
  ).then((response) => {
        console.log(response.data)
        setDocuments(response.data.list.entries)
        
        response.data.list.entries.map(d => (
          d.entry.name === 'documentLibrary' ?  
          history.push(`/document/${d.entry.id}`)
          : null
        ) 
          )
      }).catch((error) => {
        console.log(error);
      })     
}

// function handleCreateDepartment(){
//   Axios.post(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/sites`,
//   {
//    title: departmentTitle.value , visibility: "PRIVATE"
//   },
//   {
//   headers:{
//       Authorization: `Basic ${btoa(getToken())}`
//       } }
//   ).then(response => {
//     alert("Department successfully created");
//     getDepartments()
//     console.log(response)
//   }).catch(error => {
//     if (error.response.status===409){
//       alert("Department with this name already exists");
//     }
//     console.log(error)
// });
// createsetmodalIsOpen(false)
// }

function handleDeleteDepartment(id){
  Axios.delete(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/sites/${id}?permanent=false`,
  {
  headers:{
      Authorization: `Basic ${btoa(getToken())}`
      } } 
  )
  .then(response => {
    alert("Department successfully deleted");
    alertify.confirm().destroy();
    getDepartments()
    console.log(response)
  }).catch(error => {
    if (error.response.status===404){
      alert("Department does not exist");
    }
    console.log(error)
});
}
function next(){
  
  //  setSkipCount(skipCount + 10)
   console.log(skipCount);
   Axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/${url}maxItems=10&skipCount=${skipCount}`,
   {headers:{
     Authorization: `Basic ${btoa(getToken())}`
   }}).then((response) => {
    console.log(response.data)
    setDepartments(response.data.list.entries)
    setPaginationDefaultDept(response.data.list.pagination) 
    console.log(response.data.list.pagination)
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
  Axios.get(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/${url}maxItems=10&skipCount=${skipCount}`,
  {headers:{
    Authorization: `Basic ${btoa(getToken())}`
  }}).then((response) => {
   console.log(response.data)
   setDepartments(response.data.list.entries)
   setPaginationDefaultDept(response.data.list.pagination) 
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
return (
  <Fragment>
    <div id="second_section">

    <div className="title">
      <h2>My Departments</h2>
      <ProfilePic className="profile_picture"/>
      </div>
      
      <div className="search-profile">
        <Search />
        </div>

            {/* <Modal show={createmodalIsOpen}>
            <CreateDepartment createDept={handleCreateDepartment} 
            clicked={() => createsetmodalIsOpen(false)} 
            departmentTitle={departmentTitle}/>
            </Modal>
              <IconBar 
                toggleadd = {() =>{createsetmodalIsOpen(true)}}
              /> */}
      <div className='files'>
          
           <table id="doc_list">
           <tbody >
          {currentPosts.map(department => (
            
                  <tr className='details'>
                  <td className='fileicon'>
                  
                    <FontAwesomeIcon icon={faGlobeAsia} className="fas"/>
                    {department.entry.title}</td>
                    <td className='fileDetails' 
                    onClick={() => handleDocumentLibrary(department.entry.guid)}>
                    Document Library
                    {document.folders} </td>
                    <td>
                      { user === 'admin' && 
                      <Modal show={deletemodalIsOpen}>
                          <DeleteDepartment 
                            clicked={() => deletesetmodalIsOpen(false)}>
                          </DeleteDepartment>
                          <DeleteDepartment  clicked={() => deletesetmodalIsOpen(false)}></DeleteDepartment>
                        </Modal> &&
                      <div>
                    <FontAwesomeIcon icon={faTrashAlt} 
                        onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                                buttonFocus : "ok",
                                'message' : 'DO YOU WANT TO DELETE THIS DEPARTMENT '+ department.entry.title,'onok': () => {handleDeleteDepartment(department.entry.id)} ,
                                'oncancel': () => {alertify.confirm().destroy();}}).show()
                    }}
                        className="icon-item delete"/>
                      </div>
  
                      }
                      
                    </td>
                   </tr>
               
          ))}
           </tbody>
          </table> 
          <div className="col-md-6">
      <Pagination
       handlePrev={previous}
       handleNext={next}
       hasMoreItems={hasMoreItems}
       skipCount={skipCount-10}
        />
        </div>
      </div>
      </div>
     
  </Fragment>
      )
    }
    const useFormInput = initialValue => {
      const [value, setValue] = useState(initialValue);
     
      const handleChange = e => {
        setValue(e.target.value);
      }
      return {
        value,
        onChange: handleChange
      }
    }

export default DocumentsList;

