/******************************************
* File: MyUploads.js
* Desc: MyUpload page where user can see files uploaded by him/her in any department.
* @author: Vanshika Bhatt, 6 october 2020
********************************************/

import React, {useEffect,useState,Fragment} from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';

  function MyUploads(props){
    let history = useHistory();

    const [lastButtonClicked, setLastButtonClicked] = useState("");
    const[FileState,setFileState]=useState([]);
    const [hasMoreItems , setMoreItems] = useState('');
    const [skipCount , setSkipCount ] = useState('');
    const [totalitems,settotalitems] =useState('');

    useEffect(()=>{
      getData();
     },[]);

   /**
   * api call to display files which are uploaded by user
   *
   * @param {getUser()}  gives user name.
   * @return Documents id,name,type(whether file or folder)and date when 
   *          it is uploaded by user.
   */
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
              setMoreItems(response.data.list.pagination.hasMoreItems)
              setSkipCount(response.data.list.pagination.skipCount + 10)
              settotalitems(response.data.list.pagination.totalItems)
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

   /**
   * arrow function for getting file nodeid and putting it dynamically in api url to delete single/multiple documents
   * @param {close} ,used to close popup when API operation is completed successfully.
   */
  //
  const deleteFileByIds=(close)=>{
    FileState.forEach( d=>{
      if(d.select){
       Axios.delete(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.id}`, 
      {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          close();
          alertify.alert('Document Deleted Successfully').setting({
            'message': 'Document Deleted Successfully',
            'onok': () => {alertify.alert().destroy();} 
          });
          getData();
           }).catch(err=>alert(err));
       };
      })}
    
  /**
   * arrow function to Delete all documents
   * @param {close} ,used to close popup when API operation is completed successfully.
   */
  //
       const DefaultDelete=(close)=>{ 
        FileState.forEach( d=>{
          if(d.id){
          Axios.delete(getUrl()+`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${d.id}`, 
          {headers:{
          Authorization: `Basic ${btoa(getToken())}`
           }
         }).then((data)=>{
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

  /**
   * arrow function to delete document without selecting checkbox
   * @param {id}, nodeid of document which we want to delete
   */
  //
    const handleDelete=(id)=>{  
        Axios.delete(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/nodes/${id}`, 
      {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          alertify.confirm().destroy();
          alertify.alert('Document Deleted Successfully').setting({
            'message': 'Document Deleted Successfully',
            'onok': () => {alertify.alert().destroy();} 
          }); 
          getData();
           }).catch(err=>alert(err));
      }

 /**
   * function to get next items
   * desc:connected to 'next' button of pagination.
   * @param {getUser()}, to get user name.
   * @returns next items id,name,type and date when item was uploaded
   */
  //
    function next(){ //pagination next button
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
        Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
        {
          "query": 
            {"query": `cm:creator:${getUser()}`},
            "paging": {
              "maxItems": "10",
              "skipCount": `${localSkipCount}`
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
            setLastButtonClicked("next");
          });
          }
  
  /**
   * function to get previous items
   * desc:connected to 'previous' button of pagination.
   * @param {getUser()}, to get user name.
   * @returns previous items id,name,type and date when item was uploaded
   */
  //
  function previous(){ //pagination previous button
        var localSkipCount = skipCount;
      if (lastButtonClicked === "next") {
        if(localSkipCount<=20){
           localSkipCount = localSkipCount - 10;
        }
        else{
       localSkipCount = localSkipCount - 20;}
    }
    document.getElementById("myBtn").disabled = false;
      Axios.post(getUrl()+`alfresco/api/-default-/public/search/versions/1/search`,
        {
          "query": 
            {"query": `cm:creator:${getUser()}`},
            "paging": {
              "maxItems": "10",
              "skipCount": `${localSkipCount}`
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
          setLastButtonClicked("previous")
        }); 
      }

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
              />  
      </div>
    </Fragment>

          )
          }
export default MyUploads;