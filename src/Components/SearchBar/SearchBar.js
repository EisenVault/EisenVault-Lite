import React,{ useState, useEffect} from "react";
import {useHistory } from 'react-router-dom';
import Axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
//import ReactSearchBox from "react-search-box";
import OutsideClickHandler from 'react-outside-click-handler';
import "./styleSearchBar.scss";
import { getToken,getUrl } from '../../Utils/Common';
// import { instance } from "../ApiUrl/endpointName.instatnce";

 const Search = () => {
  let history = useHistory();
  const [data ,setData] = useState([]);
    const [filtered ,setFilterd] = useState([]);
    const [result , setResult] = useState("");
    const [show , setShow] = useState(false);

      // useEffect(()=>{
            const fetchData =  ()=> {
                    try{
                        Axios.get(getUrl()+`/alfresco/s/slingshot/live-search-docs?t=${result}&limit=5`,
                         
                             {headers:{
                                Authorization: `Basic ${btoa(getToken())}`
                                }
                              }).then((response) => {
                                       console.log("received")
                                     console.log(response.data)
                                     setData(response.data.items);
                                      setFilterd(response.data.items);
                                      setShow(true)
                                   });
                    }catch(err){
                      setResult("")
                      setData([])
                       setShow(false)
                        throw new Error(err);
                    }
                     };
                
      const  handleOutsideClick = (e) => {
        setShow(false)
      }
      const onChange =(e)=> {
            setResult(e.target.value);
            if (result.length !== 0)
            {
              fetchData(result);
            }
            else if (result.length === 0){
              setData([])
              setShow(false)
            }
        }
      
      const onEnter = (event) => {
        if (event.key === "Enter")
        history.push(`/search/${result}`)
      }

        function handleDocument(id , name){
           history.push(`/document-details/${id}/${name}`)
        }

    return (
        <div className="searchBox-container">
        <input 
            className="searchBox"
            type="text"
            placeholder="Type here to search ..."
            value={result}
            onChange={onChange}
            onKeyUp={onEnter}
        />   
      
        {show ? <OutsideClickHandler onOutsideClick={handleOutsideClick}><div className="menu-container">
        {data.map((r,i)=> ( 
                
                <ul key={i}>
                <li onClick={() => handleDocument(
                      r.nodeRef.substring(24),
                      r.name)}
                      className="search-item">{r.name}</li>
                </ul>
              )
            )
        }
        </div></OutsideClickHandler>: null}
    </div>
    )  

 }
  
export default Search;
