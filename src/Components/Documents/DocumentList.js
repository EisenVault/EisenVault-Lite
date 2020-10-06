import React,{Fragment , useEffect , useState} from 'react';
import {getToken,getUser,getUrl} from "../../Utils/Common";
import ProfilePic from "../Avtar/Avtar";
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import { useHistory} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faGlobeAsia } from "@fortawesome/free-solid-svg-icons";
import './DocumentList.scss';
import alertify from 'alertifyjs';
import Search from "../SearchBar/SearchBar";
import Modal from "../Modal/Modal";
import { DeleteDepartment} from "../Modal/modalSummary/ModalSummary";
import Pagination from '../Pagination/Pagination';
import Axios from 'axios';

const DocumentsList = () => {
  const user = getUser();
  let history = useHistory();
  let url;
  const [deletemodalIsOpen, deletesetmodalIsOpen] = useState(false);
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [ paginationDefualtDept, setPaginationDefaultDept ] = useState([]);
  const [ departments , setDepartments ] = useState([]);
  const [ documents , setDocuments ] = useState([]);
  const [hasMoreItems , setMoreItems] = useState('');
  const [totalitems,settotalitems]=useState('');
  const [skipCount , setSkipCount ] = useState(0);
  
  //Condition to fetch departments
    if(user === "admin")
    {
     url=`/sites?maxItems=10`
    }
    else{
      url = "/sites?maxItems=100"
    }
  
  useEffect(()=>{
   getDepartments()
     },[url]);
  
  const getDepartments=()=>{
    trackPromise(
    Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/${url}&skipCount=0`,
    {
    headers:{
        Authorization: `Basic ${btoa(getToken())}`
        }}).then((response) => {
      setDepartments(response.data.list.entries)
      setPaginationDefaultDept(response.data.list.pagination)
      settotalitems(response.data.list.pagination.totalItems)
      setMoreItems(response.data.list.pagination.hasMoreItems) 
      setSkipCount(response.data.list.pagination.skipCount + 10)    
    })
    )
  }

function handleDocumentLibrary(key){
  Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${key}/children`,
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

function handleDeleteDepartment(id){
  Axios.delete(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/sites/${id}?permanent=false`,
  {
  headers:{
      Authorization: `Basic ${btoa(getToken())}`
      } } 
  )
  .then(response => {
    alertify.confirm().destroy();
    alertify.alert('Department Deleted Successfully').setting({
      'message': 'Department Deleted Successfully',
      'onok': () => {alertify.alert().destroy();} 
    });
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
        Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/${url}&skipCount=${localSkipCount}`,
        {headers:{
          Authorization: `Basic ${btoa(getToken())}`
        }}).then((response) => {
          setDepartments(response.data.list.entries)
          setPaginationDefaultDept(response.data.list.pagination) 
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
        if(localSkipCount===10)
        {
          localSkipCount = localSkipCount - 10;
        }
        else{
      localSkipCount = localSkipCount - 20;}
    }
      document.getElementById("myBtn").disabled = false;
      Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/${url}&skipCount=${localSkipCount}`,
      {headers:{
        Authorization: `Basic ${btoa(getToken())}`
      }}).then((response) => {
      setDepartments(response.data.list.entries)
      setPaginationDefaultDept(response.data.list.pagination) 
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
          <div className='files'>
              
              <table id="doc_list">
              <tbody >
              {departments.map(department => (
                      department.entry.role ? 
                      <tr className='details' key={department.entry.id}>
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
                      </tr> : null
                  
              ))}
              </tbody>
              
              </table> 
              <LoadingIndicator/>
              <div className="col-md-6">
          <Pagination
          handlePrev={previous}
          handleNext={next}
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

